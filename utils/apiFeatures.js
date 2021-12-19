class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  // Search Products
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            // here options is for making the query value caseinsensitive..so it'll not if the value is capitalize or not..
            $options: "i",
          },
        }
      : {};

    // console.log(keyword);
    this.query = this.query.find({ ...keyword });
    return this;
  }

  // Filter Products
  filter() {
    const queryCopy = { ...this.queryStr };
    // console.log(queryCopy);
    // Removing fields for filtering products only based on category
    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((key) => delete queryCopy[key]);
    /*
    Filter for price and Rating(for price we'll use gt,gte and lt,lte operators and we also need to add "$" before them for filtering)
   */
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
    this.query = this.query.find(JSON.parse(queryStr));
    // console.log(JSON.parse(queryStr));
    return this;
  }

  // Pagination for products
  pagination(productPerPage) {
    const currentPage = this.queryStr.page || 1;
    const skip = productPerPage * (currentPage - 1);
    this.query = this.query.limit(productPerPage).skip(skip);
    return this;
  }
}
module.exports = ApiFeatures;
