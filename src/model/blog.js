// /src/model/blog.js

// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
const { fireDB, storage } = require("./firestore-db"); // Import Firestore config

class Blog {
  /**
   * Contructor 
   * @param {string} id
   * @param {string} ownerId
   * @param {string} created
   * @param {string} updated
   * @param {string} title
   * @param {string} content
   * @param {Array<{ originalname: String, buffer: Bytes }>} images
   */
  constructor({ id, ownerId, created, updated, title, content, images }) {
    // OwnerId and type are required. if not exist, throw an exception
    if (!ownerId) {
      throw new Error(
        `ownerId and type strings are required, got ownerId=${ownerId}`
      );
    }

    // get the current time 
    const currentDateTime = new Date().toISOString();

    this.ownerId = ownerId;
    this.id = id ? id : randomUUID();
    this.created = created ? created : currentDateTime;
    this.updated = updated ? updated : currentDateTime;
    this.title = title ? title : null;
    this.content = content ? content : null;
    this.images = images ? images : [];
  }

  /**
   * Get all blog (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full blogs
   * @returns Promise<Array<Blog's id>>
   */
  static async byUser(ownerId) {
    if (!ownerId) {
      const err = new Error("Owner ID is required.");
      err.status = 400;
      throw err;
    }

    const querySnapshot = await fireDB
      .collection("blogs")
      .where("ownerId", "==", ownerId)
      .orderBy("created", "desc")
      .get();

    let blogIds = querySnapshot.docs.map((doc) => doc.data().id);

    return blogIds;
  }


  /**
   * Gets a blog for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id blog's id
   * @returns Promise<Blog>
   */
  static async byId(ownerId, id) {
    if (!ownerId || !id) {
      const err = new Error("Owner ID and Blog ID are required.");
      err.status = 400;
      throw err;
    }

    const querySnapshot = await fireDB
      .collection("blogs")
      .where("ownerId", "==", ownerId)
      .where("id", "==", id)
      .get();

    if (querySnapshot.empty) {
      const err = new Error(`No blog found with: ownerId=${ownerId} with blogId=${id}`);
      err.status = 404;
      throw err;
    }

    const blogDoc = querySnapshot.docs[0];
    const blogData = blogDoc.data();

    return blogData ? new Blog(blogData) : undefined;
  }


  /**
   * Delete the user's blog for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id blog's id
   * @returns true
   */
  static async delete(ownerId, id) {
    if (!ownerId || !id) {
      throw new Error("Owner ID and Blog ID are required.");
    }

    const querySnapshot = await fireDB
      .collection("blogs")
      .where("ownerId", "==", ownerId)
      .where("id", "==", id)
      .get();

    if (querySnapshot.empty) {
      throw new Error(`No blog found for owner: ${ownerId} with ID ${id}`);
    }

    const blogDoc = querySnapshot.docs[0];
    await fireDB.collection("blogs").doc(blogDoc.id).delete();

    // Remove blog ID from all Blogger arrays (blogs, favoriteBlogs, visitedBlogs)
    const bloggerSnapshot = await fireDB
      .collection("bloggers")
      .where("blogs", "array-contains", id)
      .get();

    for (const doc of bloggerSnapshot.docs) {
      const data = doc.data();
      const updatedData = {
        blogs: data.blogs?.filter(bid => bid !== id) || [],
        favoriteBlogs: data.favoriteBlogs?.filter(bid => bid !== id) || [],
        visitedBlogs: data.visitedBlogs?.filter(bid => bid !== id) || [],
        updated: new Date().toISOString()
      };

      await fireDB.collection("bloggers").doc(doc.id).set(updatedData, { merge: true });
    }

    return true;
  }

  /**
   * Get all blogs by query
   * @param {string} keyword query for searching
   * @param {string} category optional filter
   * @returns Promise<Array<Blog>>
   */
  static async search(keyword, category = undefined) {
    if (!keyword) {
      const err = new Error(`Keyword is required`);
      err.status = 400;
      throw err;
    }

    const validCategories = ["title", "content"];
    if (category && !validCategories.includes(category)) {
      const err = new Error(`Invalid category! Only 'title' or 'content' allowed. Got category=${category}`);
      err.status = 400;
      throw err;
    }

    const searchKeyword = keyword.trim().toLowerCase();
    const querySnapshot = await fireDB.collection("blogs").orderBy("created", "desc").get();

    let matchingBlogs = [];

    querySnapshot.forEach((doc) => {
      const blogData = doc.data();

      const title = blogData.title?.trim().toLowerCase() || "";
      const content = blogData.content?.trim().toLowerCase() || "";

      const keywordRegex = new RegExp(`\\b${searchKeyword}\\b`, 'i');

      const titleMatches = keywordRegex.test(title);
      const contentMatches = keywordRegex.test(content);

      if (
        (!category && (titleMatches || contentMatches)) ||
        (category === "title" && titleMatches) ||
        (category === "content" && contentMatches)
      ) {
        matchingBlogs.push(new Blog(blogData));
      }
    });

    return matchingBlogs;
  }

  /**
  * Saves the current blog's data to the database
  * @returns blog's id
  */
  async save() {
    const currentDateTime = new Date().toISOString();
    this.updated = currentDateTime;

    const querySnapshot = await fireDB.collection("blogs").where("id", "==", this.id).get();

    let docRef;

    if (!querySnapshot.empty) {
      const existingDoc = querySnapshot.docs[0];
      docRef = fireDB.collection("blogs").doc(existingDoc.id);
    } else {
      docRef = fireDB.collection("blogs").doc();
    }

    if (this.localImages && this.localImages.length > 0) {
      this.images = [];
    
      for (const image of this.localImages) {
        if (!image || !image.buffer) {
          continue;
        }
    
        const storageRef = storage.bucket().file(`blog_images/${Date.now()}_${image.originalname}`);
    
        // Define metadata explicitly
        const metadata = {
          contentType: image.mimetype || 'image/png', // Default to PNG if missing
          cacheControl: 'public, max-age=31536000',
        };
    
        // Save image with metadata
        await storageRef.save(image.buffer, { metadata });
    
        // Make file publicly accessible (so no token is required)
        await storageRef.makePublic();
    
        const imageUrl = `https://storage.googleapis.com/${storageRef.bucket.name}/${storageRef.name}`;
        this.images.push(imageUrl);
      }
    
      this.localImages = [];
    }    

    const blogData = {
      id: this.id,
      ownerId: this.ownerId,
      created: this.created,
      updated: this.updated,
      title: this.title,
      content: this.content,
      images: this.images,
    }

    await docRef.set(blogData, { merge: true });

    // if a new blog is created
    if (querySnapshot.empty) {
      const bloggerSnapshot = await fireDB
        .collection("bloggers")
        .where("ownerId", "==", this.ownerId)
        .get();

      if (!bloggerSnapshot.empty) {
        const bloggerDoc = bloggerSnapshot.docs[0];
        const bloggerData = bloggerDoc.data();

        const updatedBlogs = Array.from(new Set([...(bloggerData.blogs || []), this.id]));

        await fireDB.collection("bloggers").doc(bloggerDoc.id).update({
          blogs: updatedBlogs,
          updated: currentDateTime,
        });
      }
    }

    return this.id;
  }

  /**
   * Gets the blog's data from the database
   * @returns Promise<data>
   */
  getData() {
    return {
      id: this.id,
      ownerId: this.ownerId,
      created: this.created,
      updated: this.updated,
      title: this.title,
      content: this.content,
      images: this.images
    };
  }

  /**
   * Set's the blog's data in the database [Or, modify an existed fragment' data]
   * @param {string} data
   * @param {string} data
   * @param {Array<{ originalname: String, buffer: Bytes }>} images
   * @returns true
   */
  setData(title, content, images) {
    if (!title && !content && (!images || images.length === 0)) {
      throw new Error(`Title, content and images are required,  title=${title}, content=${content}, images=${images}`);
    }

    this.title = title;
    this.content = content;
    this.localImages = images;

    return true;
  }
}

module.exports.Blog = Blog;
