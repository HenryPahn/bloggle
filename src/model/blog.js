// /src/model/blog.js

// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
const { fireDB, storage } = require("./firestore-db"); // Import Firestore config
const logger = require("../logger")

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
    this.images = images ? images : null;
  }

  /**
   * Get all blog (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full blogs
   * @returns Promise<Array<Blog's id>>
   */
  static async byUser(ownerId) {
    try {
      if (!ownerId) {
        throw new Error("Owner ID is required.");
      }

      const querySnapshot = await fireDB.collection("blogs").where("ownerId", "==", ownerId).get();

      if (querySnapshot.empty) {
        logger.debug(`No blogs found for owner: ${ownerId}`);
        return [];
      }

      let blogIds = querySnapshot.docs
                      .map((doc) => doc.data().id)
                      .filter((id) => id !== undefined);
      return blogIds;
    } catch (error) {
      logger.error("Error getting all blogs by userId:", error);
      return error;
    }
  }


  /**
   * Gets a blog for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id blog's id
   * @returns Promise<Blog>
   */
  static async byId(ownerId, id) {
    try {
      if (!ownerId || !id) {
        throw new Error("Owner ID and Blog ID are required.");
      }

      const querySnapshot = await fireDB
        .collection("blogs")
        .where("ownerId", "==", ownerId)
        .where("id", "==", id)
        .get();

      if (querySnapshot.empty) {
        throw new Error(`No blog found with: ${ownerId} with ID ${id}`);
      }

      const blogDoc = querySnapshot.docs[0];
      const blogData = blogDoc.data();

      return blogData ? new Blog(blogData) : undefined;
    } catch (error) {
      logger.error("Error getting a blog by id:", error);
      return error;
    }
  }


  /**
   * Delete the user's blog for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id blog's id
   * @returns true
   */
  static async delete(ownerId, id) {
    try {
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

      return true;
    } catch (error) {
      logger.error("Error deleting a blog in firestore:", error);
      return error;
    }
  }

  /**
   * Get all blogs by query
   * @param {string} keyword query for searching
   * @param {string} category optional filter
   * @returns Promise<Array<Blog>>
   */
  static async search(keyword, category = null) {
    try {
      if (!keyword) {
        throw new Error("Keyword is required.");
      }

      const searchKeyword = keyword.trim().toLowerCase();
      const querySnapshot = await fireDB.collection("blogs").get();

      let matchingBlogs = [];

      querySnapshot.forEach((doc) => {
        const blogData = doc.data();
        if (blogData.title && blogData.title.toLowerCase().includes(searchKeyword) && category != "content") {
          matchingBlogs.push(new Blog(blogData));
          return;
        }

        if (blogData.content && blogData.content.toLowerCase().includes(searchKeyword) && category != "title") {
          matchingBlogs.push(new Blog(blogData));
        }
      });

      return matchingBlogs.length ? matchingBlogs : [];
    } catch (error) {
      logger.error("Error searching blogs by title pattern:", error);
      return error;
    }
  }

  /**
  * Saves the current blog's data to the database
  * @returns blog's id
  */
  async save() {
    try {
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
            console.error("Skipping invalid image:", image);
            continue;
          }

          const storageRef = storage.bucket().file(`blog_images/${Date.now()}_${image.originalname}`);
          await storageRef.save(image.buffer);

          const imageUrl = `https://storage.googleapis.com/${storageRef.bucket.name}/${storageRef.name}`;
          this.images.push(imageUrl);
        }

        this.localImages = []; 
      }

      await docRef.set({ ...this }, { merge: true });

      return docRef.id;
    } catch (error) {
      logger.error("Error saving a blog object to firestore:", error);
      return error;
    }
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
      throw new Error(`The data isn't changed,  title=${title}, content=${content}, images=${images}`);
    }

    this.title = title;
    this.content = content;
    this.localImages = images;

    return true;
  }
}

module.exports.Blog = Blog;
