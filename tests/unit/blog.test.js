// tests/unit/blog.test.js
const { Blog } = require('../../src/model/blog');
const { search } = require('../../src/routes');

describe('Blog class', () => {
  test('Constructor: if no ownerId is provided, throw error', () => {
    expect(() => new Blog({})).toThrow();
  });

  test('byUser(): if no ownerId is provided, throw error', async () => {
    await expect(Blog.byUser()).rejects.toThrow();
  })

  test('byId(): if no ownerId and Id are provided or no blog found, throw error', async () => {
    await expect(Blog.byId()).rejects.toThrow();

    await expect(Blog.byId('jest123', 'unknown id')).rejects.toThrow();
  })

  test('delete(): if no ownerId and Id are provided or non exist blog is deleted, throw error', async () => {
    await expect(Blog.delete()).rejects.toThrow();

    await expect(Blog.delete('jest123', 'unknown id')).rejects.toThrow();
  })

  test('setData(): if none title, content, and images are provided, throw error', () => {    
    const blog = new Blog({ ownerId: 'jest123', title: 'Jest Test', content: 'Hello' });
    
    expect(() => blog.setData()).toThrow();
  });

  test('search(): if none keyword is provided, throw error', async () => {   
    await expect(Blog.search()).rejects.toThrow();
  });
  
  test("save, edit, retrieve, delete a blog", async () => {
    // create a new blog object
    const blog = new Blog({ ownerId: 'jest123', title: 'Jest Test', content: 'Hello' });
    
    // save the blog object to firestore
    const blogId = await blog.save();

    // check if save() return an ID
    expect(blogId).toBeDefined();

    // Retrieve the blog from firestore
    const obtainedBlog = await Blog.byId(blog.ownerId, blogId);

    // Get data of the blog
    const data = obtainedBlog.getData();

    // check the data of the blog
    expect(data.id).toBe(obtainedBlog.id);
    expect(data.created).toBe(obtainedBlog.created);
    expect(data.updated).toBe(obtainedBlog.updated);
    expect(data.ownerId).toBe('jest123');
    expect(data.title).toBe('Jest Test');
    expect(data.content).toBe('Hello');
    expect(data.images).toEqual(obtainedBlog.images);

    // update the data
    obtainedBlog.setData("Updated Jest Test", "Hello again"); 

    // save the updated blog to the firestore
    await obtainedBlog.save();  

    // retrieve it again
    const newObtainedBlog = await Blog.byId(blog.ownerId, blogId);

    // Get data of the blog
    const newData = newObtainedBlog.getData();

    // check the data of the blog
    expect(newData.id).toBe(newObtainedBlog.id);
    expect(newData.created).toBe(newObtainedBlog.created);
    expect(newData.updated).toBe(newObtainedBlog.updated);
    expect(newData.ownerId).toBe('jest123');
    expect(newData.title).toBe('Updated Jest Test');
    expect(newData.content).toBe('Hello again');
    expect(newData.images).toEqual(newObtainedBlog.images);

    // create a new blog object
    const secondBlog = new Blog({ ownerId: 'jest123', title: 'Second Jest Test', content: 'Hello second time' });
    
    // save the blog object to firestore
    const secondBlogId = await secondBlog.save();

    const ids = await Blog.byUser(blog.ownerId);

    expect(ids[1]).toBe(blogId);
    expect(ids[0]).toBe(secondBlogId);

    // delete the blogs
    await Blog.delete(blog.ownerId, blogId);
    await Blog.delete(secondBlog.ownerId, secondBlogId);

    // try to retrieve deleted blogs
    expect(() => Blog.byId(blog.ownerId, blogId)).rejects.toThrow();
    expect(() => Blog.byId(secondBlog.ownerId, secondBlogId)).rejects.toThrow();
  }) 

  test('Search(): search by a keyword', async () => {
    // create 3 blogs
    const firstBlog = new Blog({ ownerId: 'jest1', title: 'Jest search Test', content: 'unknownTest' });
    const secondBlog = new Blog({ ownerId: 'jest2', title: 'unknownTest', content: 'Hello' });
    const thirdBlog = new Blog({ ownerId: 'jest3', title: 'unknownTest', content: 'unknownTest' });

    // save blogs to the firestore
    const firstBlogId = await firstBlog.save();
    const secondBlogId = await secondBlog.save();
    const thirdBlogId = await thirdBlog.save();

    // search blogs without filter
    let foundBlogs = await Blog.search("unknownTest"); 
    expect(foundBlogs.length).toBe(3);

    // search blogs with title filter
    foundBlogs = await Blog.search("unknownTest", "title"); 
    expect(foundBlogs.length).toBe(2);

    // search blogs with content filter
    foundBlogs = await Blog.search("unknownTest", "content"); 
    expect(foundBlogs.length).toBe(2);

    // delete the blogs
    await Blog.delete(firstBlog.ownerId, firstBlogId);
    await Blog.delete(secondBlog.ownerId, secondBlogId);
    await Blog.delete(thirdBlog.ownerId, thirdBlogId);
  })
});
