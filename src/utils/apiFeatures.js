export class ApiFeatures {
  constructor(mongooseQuery, searchQuery) {
    this.mongooseQuery = mongooseQuery;
    this.searchQuery = searchQuery;
  }

  filter() {
    let filterObj = { ...this.searchQuery };
    let excludedFields = ["page", "sort", "limit", "fields", "keyword"];
    excludedFields.forEach((val) => {
      delete filterObj[val];
    });

    filterObj = JSON.stringify(filterObj);
    filterObj = filterObj.replace(/(gt|gte|lt|lte)/g, (match) => "$" + match);
    filterObj = JSON.parse(filterObj);
    this.mongooseQuery.find(filterObj);
    return this;
  }

  sort() {
    if (this.searchQuery.sort) {
      let sortBy = this.searchQuery.sort.split(",").join(" ");
      this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createAt");
    }
    return this;
  }

  limitedFields() {
    if (this.searchQuery.fields) {
      let fields = this.searchQuery.fields.split(",").join(" ");
      this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  search(modelName) {
    if (this.searchQuery.keyword) {
      let query = {};
      query = {
        companyName: { $regex: this.searchQuery.keyword, $options: "i" },
      };
      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }
  paginate(countDocuments) {
    const page = this.searchQuery.page * 1 || 1;
    const limit = this.searchQuery.limit * 1 || 50;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    // Pagination result
    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numberOfPages = Math.ceil(countDocuments / limit);

    // next page
    if (endIndex < countDocuments) {
      pagination.next = page + 1;
    }
    if (skip > 0) {
      pagination.prev = page - 1;
    }
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

    this.paginationResult = pagination;
    return this;
  }
}
