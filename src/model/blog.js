// /src/model/blog.js

// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
const { collection, getDocs, query, where, setDoc, doc, deleteDoc } = require("firebase/firestore");
const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
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
    this.title = title ? title : undefined;
    this.content = content ? content : undefined;
    this.images = images ? images : undefined;
  }

  /**
   * Get all blog (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full blogs
   * @returns Promise<Array<Blog's id>>
   */
  static async byUser(ownerId) {
    try {
      // Query Firestore to find all blogs where ownerId matches
      const blogRefs = query(collection(fireDB, "blogs"), where("ownerId", "==", ownerId));
      const blogSnaps = await getDocs(blogRefs);

      if (blogSnaps.empty) {
        console.log(`No blogs found for owner: ${ownerId}`);
        return [];
      }

      let blogIds = blogSnaps.docs.map((doc) => doc.data().id);
      return blogIds;
    } catch (error) {
      console.error("Error getting all blogs by userId:", error);
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
      // Query Firestore where both ownerId and document ID match
      const q = query(
        collection(fireDB, "blogs"),
        where("ownerId", "==", ownerId),
        where("id", "==", id) // "__name__" refers to the document ID
      );

      const querySnapshot = await getDocs(q);

      // If no documents found, return null
      if (querySnapshot.empty) {
        throw new Error(`No blog found for owner: ${ownerId} with ID ${id}`);
      }

      // Extract blog data (since __name__ is unique, there will be at most 1 result)
      const blogDoc = querySnapshot.docs[0];
      const blogData = blogDoc.data();

      return blogDoc ? new Blog(blogData) : undefined;
    } catch (error) {
      console.error("Error getting a blog by id:", error);
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
      // Query Firestore where both ownerId and id (inside document) match
      const q = query(
        collection(fireDB, "blogs"),
        where("ownerId", "==", ownerId),
        where("id", "==", id)
      );

      const querySnapshot = await getDocs(q);

      // If no matching document is found, return a message
      if (querySnapshot.empty) {
        throw new Error(`No blog found for owner: ${ownerId} with ID ${id}`);
      }

      const blogDoc = querySnapshot.docs[0]; // Only one document should match
      const docRef = doc(fireDB, "blogs", blogDoc.id);

      // Delete the document
      await deleteDoc(docRef);

      return true;
    } catch (error) {
      console.error("Error deleting a blog in firestore:", error);
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
      // Trim and ensure keyword is properly formatted
      const searchKeyword = keyword.trim().toLowerCase();

      // Fetch all blogs (Firestore does not support substring search directly)
      const querySnapshot = await getDocs(collection(fireDB, "blogs"));

      let matchingBlogs = [];

      querySnapshot.forEach((doc) => {
        const blogData = doc.data();
        if (blogData.title && blogData.title.toLowerCase().includes(searchKeyword) && category != "content" && category != "author") {
          matchingBlogs.push(new Blog(blogData));
        }
      });

      querySnapshot.forEach((doc) => {
        const blogData = doc.data();
        if (blogData.content && blogData.content.toLowerCase().includes(searchKeyword) && category != "title" && category != "author") {
          matchingBlogs.push(new Blog(blogData));
        }
      });

      // Add and implement author later
      // querySnapshot.forEach((doc) => {
      //   const blogData = doc.data();
      //   if (blogData.author && blogData.author.toLowerCase().includes(searchKeyword) && category != "title" && category != "content") {
      //     matchingBlogs.push(new Blog(blogData));
      //   }
      // });

      return matchingBlogs.length ? matchingBlogs : [];
    } catch (error) {
      console.error("Error searching blogs by title pattern:", error);
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

      const q = query(collection(fireDB, "blogs"), where("id", "==", this.id));
      const querySnapshot = await getDocs(q);

      let docRef;

      if (!querySnapshot.empty) {
        // If a document with the same `id` exists, use its Firestore document ID
        const existingDoc = querySnapshot.docs[0];
        docRef = doc(fireDB, "blogs", existingDoc.id);
      } else {
        // If no document exists, create a new document using Firestore-generated ID
        docRef = doc(collection(fireDB, "blogs"));
      }

      if (this.localImages && this.localImages.length > 0) {
        this.images = [];

        for (const image of this.localImages) {
          if (!image || !image.buffer) {
            console.error("Skipping invalid image:", image);
            continue;
          }

          // Upload image buffer to Firebase Storage
          const storageRef = ref(storage, `blog_images/${Date.now()}_${image.originalname}`);
          const snapshot = await uploadBytes(storageRef, image.buffer);
          const imageUrl = await getDownloadURL(snapshot.ref);

          this.images.push(imageUrl);
        }

        this.localImages = []; // Clear local buffer after upload
      }

      await setDoc(docRef, { ...this }, { merge: true });

      return docRef.id;
    } catch (error) {
      console.error("Error saving a blog object to firestore:", error);
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
  async setData(title, content, images) {
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
