// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');

class Blogger {
  /**
   * Contructor 
   * @param {string} id
   * @param {string} ownerId
   * @param {string} created
   * @param {string} updated
   */
  constructor({ id, ownerId, created, updated, favoriteBlogs, visitedBlogs}) {
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
    this.favoriteBlogs = favoriteBlogs ? favoriteBlogs : []; 
    this.visitedBlogs = visitedBlogs ? visitedBlogs : []
  }

  /**
  * Saves the current blogger's data to the database
  * @returns a successful message
  */
  // save() {
  // }
  
  /************************************************************/
  // favorite blog section

  /**
   * Get all favorite blogs (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full blogs
   * @returns Promise<Array<Blog>>
   */
  // static async favouriteBlogsByUser(ownerId, expand = false) {
  // }

  /**
   * Add a blog id to favorite blog list 
   * @param {string} blogId
   * @returns a successful message
   */
  // async addFavouriteBlog(blogId) {
  // }

  /**
   * Delete the user's blog for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id blog's id
   * @returns a successful message
   */
  // static deleteFavouriteBlog(ownerId, id) {
  // }

  /************************************************************/
  // visited blog section

  /**
   * Get all visited blogs (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full blogs
   * @returns Promise<Array<Blog>>
   */
  // static async visitedBlogsByUser(ownerId, expand = false) {
  // }

  /**
   * Add a blog id to visited blog list in the database
   * @param {string} blogId
   * @returns a successful message
   */
  // async addVisitedBlog(blogId) {
  // }

  /**
   * Delete the user's blog for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id blog's id
   * @returns a successful message
   */
  // static deleteVisitedBlog(ownerId, id) {
  // }
}

module.exports.Blogger = Blogger;
