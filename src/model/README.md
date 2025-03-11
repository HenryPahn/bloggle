const { Blog } = require('../blog'); 

const blogPost = {
  ownerId: "1234",
  title: "My sixth Blog Post",
  content: "This is my not blog post on the platform.",
};

async function test( ) {
  try {
    // save a data to blog
    // const newBlog = new Blog(blogPost)
    // newBlog.save()

    // get all blog ids of a user with id 1234
    // const data = await Blog.byUser("1234");
    // console.log(data)

    // get a blog object from database
    // const foundBlog = await Blog.byId("1234", "3abbb53d-260d-406a-b823-9b4c462fccaf");
    // console.log(foundBlog);

    // set data to the blog object
    // foundBlog.setData("sixth", "sixth blogs", null);
    
    // save or modify a blog object to database
    // foundBlog.save();

    // get data of a blog
    // console.log(foundBlog.getData())

    // delete a blog
    // await Blog.delete("1234", "3abbb53d-260d-406a-b823-9b4c462fccaf")

    // search a blog by title 
    // const data = await Blog.search("sixth", "title");
    // console.log(data);
  } catch(err) {
    console.log(err)
  }
}

test()
