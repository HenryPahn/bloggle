// /src/mode/blogger.js

const { Blog } = require('./blog');
const { fireDB } = require('./firestore-db');

class Blogger {
  /**
   * Contructor
   * @param {string} id
   * @param {string} ownerId
   * @param {string} created
   * @param {string} updated
   */
  constructor({ ownerId, created, updated, blogs, favoriteBlogs, visitedBlogs }) {
    // OwnerId and type are required. if not exist, throw an exception
    if (!ownerId) {
      throw new Error(`ownerId and type strings are required, got ownerId=${ownerId}`);
    }

    // get the current time
    const currentDateTime = new Date().toISOString();

    this.ownerId = ownerId;
    this.created = created ? created : currentDateTime;
    this.updated = updated ? updated : currentDateTime;
    this.blogs = blogs ? blogs : [];
    this.favoriteBlogs = favoriteBlogs ? favoriteBlogs : [];
    this.visitedBlogs = visitedBlogs ? visitedBlogs : [];
  }

  /**
   * get the Blogger object by ownerId from the firebase
   * @returns a successful message
   */
  static async byUser(ownerId) {
    if (!ownerId) {
      throw new Error('Owner ID is required.');
    }

    const querySnapshot = await fireDB.collection('bloggers').where('ownerId', '==', ownerId).get();

    if (querySnapshot.empty) {
      throw new Error(`No blogger found with ownerId: ${ownerId}`);
    }

    const bloggerDoc = querySnapshot.docs[0];
    const bloggerData = bloggerDoc.data();

    return new Blogger(bloggerData);
  }

  /**
   * Saves the current blogger's data to the database
   * @returns a successful message
   */
  async save() {
    const currentDateTime = new Date().toISOString();
    this.updated = currentDateTime;

    // Query Firestore to check if the blogger exists
    const querySnapshot = await fireDB
      .collection('bloggers')
      .where('ownerId', '==', this.ownerId)
      .get();

    let docRef;
    if (!querySnapshot.empty) {
      const existingDoc = querySnapshot.docs[0];
      docRef = fireDB.collection('bloggers').doc(existingDoc.id);
    } else {
      docRef = fireDB.collection('bloggers').doc();
    }

    this.blogs = await Blog.byUser(this.ownerId);

    await docRef.set({ ...this }, { merge: true });
    return this.ownerId;
  }

  /**
   * Deletes a blogger document from Firestore by ownerId
   * @param {string} ownerId - The ownerId of the blogger to delete
   * @returns {Promise<void>}
   */
  static async delete(ownerId) {
    if (!ownerId) {
      throw new Error('Owner ID is required.');
    }

    // Query Firestore to find the blogger document by ownerId
    const querySnapshot = await fireDB
      .collection('bloggers')
      .where('ownerId', '==', ownerId)
      .get();

    if (querySnapshot.empty) {
      throw new Error(`No blogger found with ownerId: ${ownerId}`);
    }

    // Delete the document
    const bloggerDoc = querySnapshot.docs[0];
    await fireDB.collection('bloggers').doc(bloggerDoc.id).delete();
  }

  getData() {
    return {
      ownerId: this.ownerId,
      created: this.created,
      updated: this.updated,
      blogs: this.blogs,
      favoriteBlogs: this.favoriteBlogs,
      visitedBlogs: this.visitedBlogs,
    };
  }

  /************************************************************/
  // favorite blog section

  /**
   * Get all favorite blogs (id or full) for the given user
   * @returns Promise<Array<Blog's id>>
   */
  getFavouriteBlogs() {
    return this.favoriteBlogs;
  }

  /**
   * Add a blog id to favorite blog list
   * @param {string} blogId
   * @returns true
   */
  addFavoriteBlog(blogId) {
    if (!blogId) {
      throw new Error(`Blog ID is required, got blogId=${blogId}`);
    }

    if (this.favoriteBlogs.includes(blogId)) {
      throw new Error(`Blog is already added to favorite list!`);
    }

    this.favoriteBlogs.push(blogId);
    return true;
  }

  /**
   * Delete a user's favorite blog
   * @param {string} blogId
   * @returns true
   */
  deleteFavoriteBlog(blogId) {
    if (!blogId) {
      throw new Error(`Blog ID is required, got blogId=${blogId}`);
    }

    if (!this.favoriteBlogs.includes(blogId)) {
      throw new Error(`Blog doesn't exist in favorite list!`);
    }

    this.favoriteBlogs = this.favoriteBlogs.filter((id) => id !== blogId);
    return true;
  }

  /************************************************************/
  // visited blog section

  /**
   * Get all visited blogs (id or full) for the given user
   * @returns Promise<Array<Blog's id>>
   */
  getVisitedBlogs() {
    return this.visitedBlogs;
  }

  /**
   * Add a blog id to visited blog list in the database
   * @param {string} blogId
   * @returns true
   */
  async addVisitedBlog(blogId) {
    if (!blogId) {
      throw new Error(`Blog ID is required, got blogId=${blogId}`);
    }

    if (this.visitedBlogs.includes(blogId)) {
      throw new Error(`Blog is already added to visited list!`);
    }

    this.visitedBlogs.push(blogId);
    return true;
  }

  /**
   * Delete the user's blog for the given id
   * @param {string} blogId blog's id
   * @returns true
   */
  deleteVisitedBlog(blogId) {
    if (!blogId) {
      throw new Error(`Blog ID is required, got blogId=${blogId}`);
    }

    if (!this.visitedBlogs.includes(blogId)) {
      throw new Error(`Blog doesn't exist in visited list!`);
    }

    this.visitedBlogs = this.visitedBlogs.filter((id) => id !== blogId);
    return true;
  }
}

module.exports.Blogger = Blogger;
