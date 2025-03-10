// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');

class Blog {
  /**
   * Contructor 
   * @param {string} id
   * @param {string} ownerId
   * @param {string} created
   * @param {string} updated
   */
  constructor({ id, ownerId, created, updated }) {
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
  }

  /**
   * Get all blog (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full blogs
   * @returns Promise<Array<Blog>>
   */
  // static async byUser(ownerId, expand = false) {
  // }

  /**
   * Gets a blog for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id blog's id
   * @returns Promise<Blog>
   */
  // static async byId(ownerId, id) {
  // }

  /**
   * Delete the user's blog for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id blog's id
   * @returns a successful message
   */
  // static delete(ownerId, id) {
  // }

  /**
   * Get all blogs by query
   * @param {string} keyword query for searching
   * @param {string} category optional filter
   * @returns Promise<Array<Blog>>
   */
  // static async searchByQuery(ownerId, keyword, category = null) {
  // }

  /**
  * Saves the current blog's data to the database
  * @returns a successful message
  */
  // save() {
  // }

  /**
   * Gets the blog's data from the database
   * @returns Promise<data>
   */
  // getData() {
  // }

  /**
   * Set's the blog's data in the database [Or, modify an existed fragment' data]
   * @param {Buffer} data
   * @returns a successful message
   */
  // async setData(data) {
  // }
}

module.exports.Blog = Blog;
