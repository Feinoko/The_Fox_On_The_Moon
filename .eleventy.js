module.exports = function(_11tyConfig) {

  _11tyConfig.addPassthroughCopy('ssg-src/media', '/');
  _11tyConfig.addPassthroughCopy('ssg-src/admin', '/');

  return {
    dir: {
      input: "ssg-src",
      includes: "_includes", // default
      data: "_data", // default
      output: "src"
    },
    pathPrefix: "/src/", // prepends the subdirectory 'src' before all absolute paths that you get when you use post.url for instance which acts as if your output files are in the root folder absolute path and so will give /posts/post-one/ instead of what we want : /src/posts/post-one
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
  }
}

