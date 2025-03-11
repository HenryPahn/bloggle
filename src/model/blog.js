// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
const { collection, getDocs, query, where, setDoc, doc, deleteDoc } = require("firebase/firestore");
const { fireDB } = require("./firestore-db"); // Import Firestore config

class Blog {
  /**
   * Contructor 
   * @param {string} id
   * @param {string} ownerId
   * @param {string} created
   * @param {string} updated
   */
  constructor({ id, ownerId, created, author, updated, title, content, images = null }) {
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
    this.author = author;
    this.title = title;
    this.content = content;
    this.images = images;
  }

  /**
   * Get all blog (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full blogs
   * @returns Promise<Array<Blog>>
   */
  static async byUser(ownerId) {
    try {
      // Query Firestore to find all blogs where ownerId matches
      const blogRefs = query(collection(fireDB, "blogs"), where("ownerId", "==", ownerId));
      const blogSnaps = await getDocs(blogRefs);

      let blogIds = blogSnaps.docs.map((doc) => doc.data().id);

      return blogSnaps.empty ? blogIds : [];
    } catch (error) {
      console.error("Error:", error);
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
        where("id", "==", id) 
      );

      const querySnapshot = await getDocs(q);

      // If no documents found, return null
      if (querySnapshot.empty) {
        throw new Error(`No blog found for owner: ${ownerId} with ID ${id}`);
      }

      const blogDoc = querySnapshot.docs[0];
      const blogData = blogDoc.data();

      return new Blog(blogData);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  /**
   * Delete the user's blog for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id blog's id
   * @returns a successful message
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

      const blogDoc = querySnapshot.docs[0]; 
      const docRef = doc(fireDB, "blogs", blogDoc.id);

      // Delete the document
      await deleteDoc(docRef);

      return true;
    } catch (error) {
      console.error("Error:", error);
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

      querySnapshot.forEach((doc) => {
        const blogData = doc.data();
        if (blogData.author && blogData.author.toLowerCase().includes(searchKeyword) && category != "title" && category != "content") {
          matchingBlogs.push(new Blog(blogData));
        }
      });

      return matchingBlogs.length ? matchingBlogs : [];
    } catch (error) {
      console.error("Error:", error);
    }
  }

  /**
  * Saves the current blog's data to the database
  * @returns a successful message
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

      // Set data in Firestore (merge: true to avoid overwriting)
      await setDoc(docRef, { ...this }, { merge: true });

      return docRef.id;
    } catch (error) {
      console.error("Error:", error);
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
   * @param {Buffer} data
   * @returns a successful message
   */
  async setData(title, content, images) {
    this.title = title ? title : this.title;
    this.content = content ? content : this.content;
    this.images = images ? images : this.images;
  }
}

module.exports.Blog = Blog;
