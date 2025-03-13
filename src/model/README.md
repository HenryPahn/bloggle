

const { Blog } = require('../blog');
const fs = require('fs');
const path = require('path');

// const blogPost = {
//   ownerId: "1234",
//   title: "My sixth Blog Post",
//   content: "This is my not blog post on the platform.",
// };

async function testBlog() {
  try {
    // save a data to blog
    // const newBlog = new Blog(blogPost)
    // newBlog.save()

    // get all blog ids of a user with id 1234
    // const data = await Blog.byUser("1234");
    // console.log(data)

    // get a blog object from database
    const foundBlog = await Blog.byId("1234", "4c1bf690-a3fa-4a8d-85e7-114f04b76785");
    console.log(foundBlog);

    const imagePath = path.join(__dirname, "example.jpg"); // Assuming example.jpg is in the same folder

    if (!fs.existsSync(imagePath)) {
      console.log("Image file not found:", imagePath);
      return;
    }

    const imageBuffer = fs.readFileSync(imagePath);

    // set data with images
    await foundBlog.setData("Updated Sixth Blog", "Updated content", [
      {
        originalname: "example.jpg",
        buffer: imageBuffer,
      }
    ]);
    // get data of a blog
    console.log(foundBlog.getData())

    // save or modify a blog object to database
    await foundBlog.save();

    // get data of a blog
    // console.log(foundBlog.getData())

    // delete a blog
    // await Blog.delete("1234", "3abbb53d-260d-406a-b823-9b4c462fccaf")

    // search a blog by title 
    // const data = await Blog.search("sixth", "title");
    // console.log(data);
  } catch (err) {
    console.log(err)
  }
}

testBlog()


async function testBlogger() {
  try {
    const blogger = new Blogger({
      ownerId: "user1234",
      blogs: ["blog1", "blog2"],
      favoriteBlogs: ["blog3"],
      visitedBlogs: ["blog4"]
    });

    // console.log(blogger.getFavouriteBlogs());

    //  blogger.addFavoriteBlog("blog4");
    
    //  blogger.deleteFavoriteBlog("blog3");

    // console.log(blogger.getFavouriteBlogs());

    // console.log(blogger.getVisitedBlogs());

    //  blogger.addVisitedBlog("blog5");
    
    //  blogger.deleteVisitedBlog("blog4");

    // console.log(blogger.getVisitedBlogs());

    // const docId = await blogger.save();
    
    
    const data = await Blogger.byUser("user1234");
    console.log(data);
  } catch (error) {
    console.error("Error:", error);
  }
}

testBlogger();
