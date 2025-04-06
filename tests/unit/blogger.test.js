const { Blogger } = require('../../src/model/blogger');
const { Blog } = require('../../src/model/blog');

describe('Blogger class', () => {
  test('Constructor: if no ownerId is provided, throw error', () => {
    expect(() => new Blogger({})).toThrow('ownerId and type strings are required');
  });

  test('byUser(): if no ownerId is provided, throw error', async () => {
    await expect(Blogger.byUser()).rejects.toThrow('Owner ID is required.');
  });

  test('save(): save a new blogger to Firestore', async () => {
    const blogger = new Blogger({ ownerId: 'jest123' });
    const bloggerId = await blogger.save();

    // Check if save() returns an ID
    expect(bloggerId).toBeDefined();

    // Retrieve the blogger from Firestore
    const obtainedBlogger = await Blogger.byUser('jest123');

    // Check the data of the blogger
    expect(obtainedBlogger.ownerId).toBe('jest123');
    expect(obtainedBlogger.created).toBeDefined();
    expect(obtainedBlogger.updated).toBeDefined();
    expect(obtainedBlogger.blogs).toEqual([]);
    expect(obtainedBlogger.favoriteBlogs).toEqual([]);
    expect(obtainedBlogger.visitedBlogs).toEqual([]);

    // Clean up: Delete the blogger
    await Blogger.delete(bloggerId);
  });

  test('getData(): return blogger data as an object', () => {
    const blogger = new Blogger({ ownerId: 'jest123' });
    const data = blogger.getData();

    expect(data).toEqual({
      ownerId: 'jest123',
      created: blogger.created,
      updated: blogger.updated,
      blogs: [],
      favoriteBlogs: [],
      visitedBlogs: [],
    });
  });

  test('addFavoriteBlog(): add a blog to favorite list', () => {
    const blogger = new Blogger({ ownerId: 'jest123' });
    blogger.addFavoriteBlog('blog123');

    expect(blogger.getFavouriteBlogs()).toContain('blog123');
  });

  test('addFavoriteBlog(): throw error if blog is already in favorite list', () => {
    const blogger = new Blogger({ ownerId: 'jest123' });
    blogger.addFavoriteBlog('blog123');

    expect(() => blogger.addFavoriteBlog('blog123')).toThrow('Blog is already added to favorite list!');
  });

  test('deleteFavoriteBlog(): if none blogId is provided and non-exist blog is deleted, throw error', () => {    
    const blogger = new Blogger({ ownerId: 'jest123' });
    
    expect(() => blogger.deleteFavoriteBlog()).toThrow();

    expect(() => blogger.deleteFavoriteBlog("unknownId")).toThrow();
  });

  test('deleteFavoriteBlog(): remove a blog from favorite list', () => {
    const blogger = new Blogger({ ownerId: 'jest123' });
    blogger.addFavoriteBlog('blog123');
    blogger.deleteFavoriteBlog('blog123');

    expect(blogger.getFavouriteBlogs()).not.toContain('blog123');
  });

  test('deleteFavoriteBlog(): throw error if blog is not in favorite list', () => {
    const blogger = new Blogger({ ownerId: 'jest123' });

    expect(() => blogger.deleteFavoriteBlog('blog123')).toThrow('Blog doesn\'t exist in favorite list!');
  });

  test('addVisitedBlog(): add a blog to visited list', async () => {
    const blogger = new Blogger({ ownerId: 'jest123' });
    await blogger.addVisitedBlog('blog123');

    expect(blogger.getVisitedBlogs()).toContain('blog123');
  });

  test('addVisitedBlog(): throw error if blog is already in visited list', async () => {
    const blogger = new Blogger({ ownerId: 'jest123' });
    await blogger.addVisitedBlog('blog123');

    await expect(blogger.addVisitedBlog('blog123')).rejects.toThrow('Blog is already added to visited list!');
  });

  test('deleteVisitedBlog(): remove a blog from visited list', () => {
    const blogger = new Blogger({ ownerId: 'jest123' });
    blogger.addVisitedBlog('blog123');
    blogger.deleteVisitedBlog('blog123');

    expect(blogger.getVisitedBlogs()).not.toContain('blog123');
  });

  test('deleteVisitedBlog(): throw error if blog is not in visited list', () => {
    const blogger = new Blogger({ ownerId: 'jest123' });

    expect(() => blogger.deleteVisitedBlog('blog123')).toThrow('Blog doesn\'t exist in visited list!');
  });

  test('save(): update an existing blogger in Firestore', async () => {
    // Create and save a new blogger
    const blogger = new Blogger({ ownerId: 'jest123' });
    const bloggerId = await blogger.save();

    // Update the blogger's favorite blogs
    blogger.addFavoriteBlog('blog123');
    await blogger.save();

    // Retrieve the updated blogger
    const updatedBlogger = await Blogger.byUser('jest123');

    // Check if the favorite blog was saved
    expect(updatedBlogger.getFavouriteBlogs()).toContain('blog123');

    // Clean up: Delete the blogger
    await Blogger.delete(bloggerId);
  });

  test('byUser(): throw error if no blogger is found', async () => {
    await expect(Blogger.byUser('unknownOwnerId')).rejects.toThrow('No blogger found with ownerId=unknownOwnerId');
  });
});
