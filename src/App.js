import React from "react";
import { Collection } from "./components/Collection";
import { categories } from "./constants/categories";
import "./index.scss";

function App() {
  const [collections, setCollections] = React.useState([]);
  const [isLoading, setLoading] = React.useState(true);
  const [searchValue, setSearchValue] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    setLoading(true);
    const category = activeIndex ? `category=${activeIndex}` : "";

    fetch(
      `https://65e5e539d7f0758a76e7b037.mockapi.io/photos?page=${page}&limit=3&${category}`
    )
      .then((res) => res.json())
      .then((data) => setCollections(data))
      .catch((err) => console.warn(err))
      .finally(() => setLoading(false));
  }, [activeIndex, page]);

  const isActive = (index) => {
    return `${activeIndex === index ? "active" : ""}`;
  };
  const handleCategoryClick = (index) => {
    setActiveIndex(index);
  };
  const isExistedCollection = () => {
    const existedCollections = collections.filter((collection) => {
      const name = collection.name.toLowerCase();
      const value = searchValue.toLocaleLowerCase();

      return name.includes(value);
    });

    return existedCollections;
  };
  const showCollections = () => {
    const existedCollections = isExistedCollection();
    const collectionsToShow = existedCollections.map((collection, index) => {
      return (
        <Collection
          key={index}
          name={collection.name}
          images={collection.photos}
        />
      );
    });

    return collectionsToShow;
  };
  const createCategories = () => {
    const categoriesToShow = categories.map((category, index) => (
      <li
        key={index}
        className={isActive(index)}
        onClick={() => handleCategoryClick(index)}
      >
        {category.name}
      </li>
    ));

    return categoriesToShow;
  };
  const createPagination = () => {
    const paginationButtons = [...Array(5)].map((_, index) => (
      <li
        key={index}
        className={page === index + 1 ? "active" : ""}
        onClick={() => setPage(index + 1)}
      >
        {index + 1}
      </li>
    ));

    return paginationButtons;
  };

  return (
    <div className="App">
      <h1>My collection</h1>
      <div className="top">
        <ul className="tags">{createCategories()}</ul>
        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="search-input"
          placeholder="Name searching ..."
        />
      </div>
      <div className="content">
        {isLoading ? <h2>...loading</h2> : showCollections()}
      </div>
      <ul className="pagination">{createPagination()}</ul>
    </div>
  );
}

export default App;
