const apiUrl = "/api";

document.addEventListener("DOMContentLoaded", () => {
  loadCategories();
  loadSources();
  loadNews();

  const newsForm = document.getElementById("news-form");
  const categoryForm = document.getElementById("category-form");
  const sourceForm = document.getElementById("source-form");

  newsForm.addEventListener("submit", handleNewsSubmit);
  categoryForm.addEventListener("submit", handleCategorySubmit);
  sourceForm.addEventListener("submit", handleSourceSubmit);

  const modal = document.getElementById("news-modal");
  const closeModalButton = document.getElementById("close-modal");

  closeModalButton.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
});

async function loadCategories() {
  try {
    const response = await fetch(`${apiUrl}/categories`);
    const categories = await response.json();
    const categorySelect = document.getElementById("categories");
    const categoryList = document.getElementById("category-list");

    categorySelect.innerHTML = "";
    categoryList.innerHTML = "";

    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category._id;
      option.textContent = category.name;
      categorySelect.appendChild(option);

      const listItem = document.createElement("li");
      listItem.textContent = category.name;
      categoryList.appendChild(listItem);
    });
  } catch (error) {
    console.error("Error loading categories:", error);
  }
}

async function loadSources() {
  try {
    const response = await fetch(`${apiUrl}/news/sources`);
    const sources = await response.json();
    const sourceSelect = document.getElementById("source");
    const sourceList = document.getElementById("source-list");

    sourceSelect.innerHTML = "";
    sourceList.innerHTML = "";

    sources.forEach((source) => {
      const option = document.createElement("option");
      option.value = source._id;
      option.textContent = source.name;
      sourceSelect.appendChild(option);

      const listItem = document.createElement("li");
      listItem.textContent = source.name;
      sourceList.appendChild(listItem);
    });
  } catch (error) {
    console.error("Error loading sources:", error);
  }
}

async function loadNews() {
  try {
    const response = await fetch(`${apiUrl}/news`);
    const newsItems = await response.json();
    const newsList = document.getElementById("news-list");

    newsList.innerHTML = "";

    newsItems.forEach((news) => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `
                <span><strong>Title:</strong> ${news.title}</span>
                <span><strong>Category:</strong> ${news.categories
                  .map((c) => c.name)
                  .join(", ")}</span>
                <span><strong>Source:</strong> ${news.source.name}</span>
                <span><strong>Rank:</strong> ${news.rank}</span>
                <button onclick="viewNews('${news._id}')">View</button>
                <button onclick="editNews('${news._id}')">Edit</button>
                <button onclick="deleteNews('${news._id}')">Delete</button>
            `;
      newsList.appendChild(listItem);
    });
  } catch (error) {
    console.error("Error loading news:", error);
  }
}

async function handleNewsSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const newsId = formData.get("_id");

  try {
    let response;
    if (newsId) {
      // Update existing news
      response = await fetch(`${apiUrl}/news/${newsId}`, {
        method: "PUT",
        body: formData,
      });
    } else {
      // Create new news
      response = await fetch(`${apiUrl}/news`, {
        method: "POST",
        body: formData,
      });
    }

    if (!response.ok) {
      throw new Error(`Failed to ${newsId ? "update" : "create"} news`);
    }

    loadNews();
    event.target.reset();
    document.getElementById("news-id").value = ""; // Clear the hidden ID field
  } catch (error) {
    console.error("Error creating/updating news:", error);
  }
}

async function handleCategorySubmit(event) {
  event.preventDefault();

  const categoryName = document.getElementById("category-name").value;

  try {
    const response = await fetch(`${apiUrl}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: categoryName }),
    });

    if (!response.ok) {
      throw new Error("Failed to create category");
    }

    loadCategories();
    event.target.reset();
  } catch (error) {
    console.error("Error creating category:", error);
  }
}

async function handleSourceSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.target);

  try {
    const response = await fetch(`${apiUrl}/news/sources`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to create source");
    }

    loadSources();
    event.target.reset();
  } catch (error) {
    console.error("Error creating source:", error);
  }
}

async function deleteNews(id) {
  try {
    const response = await fetch(`${apiUrl}/news/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete news");
    }

    loadNews();
  } catch (error) {
    console.error("Error deleting news:", error);
  }
}

async function viewNews(id) {
  try {
    const response = await fetch(`${apiUrl}/news/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch news");
    }
    const news = await response.json();

    document.getElementById("modal-title").textContent = news.title;
    document.getElementById("modal-image").src = news.image;
    document.getElementById("modal-description").textContent = news.description;
    document.getElementById("modal-categories").textContent = news.categories
      .map((c) => c.name)
      .join(", ");
    document.getElementById("modal-source").textContent = news.source.name;
    document.getElementById("source-image").src = news.source.image;
    document.getElementById("modal-rank").textContent = news.rank;
    document.getElementById("modal-created-at").textContent = new Date(
      news.createdAt
    ).toLocaleString();
    document.getElementById("modal-updated-at").textContent = new Date(
      news.updatedAt
    ).toLocaleString();

    const modal = document.getElementById("news-modal");
    modal.style.display = "block";
  } catch (error) {
    console.error("Error fetching news details:", error);
  }
}

async function editNews(id) {
  try {
    const response = await fetch(`${apiUrl}/news/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch news");
    }
    const news = await response.json();

    console.log(news);
    

    // Populate the form fields with the existing news data
    document.getElementById("title").value = news.title;
    document.getElementById("description").value = news.description;
    document.getElementById("categories").value = news.categories
      .map((c) => c.name)
      .join(", ");
    document.getElementById("source").value = news.source._id;
    document.getElementById("rank").value = news.rank;
    document.getElementById("news-id").value = news._id; // Set the hidden ID field

    // Make image non-required in the edit mode
    document.getElementById("image").removeAttribute("required");
  } catch (error) {
    console.error("Error fetching news details:", error);
  }
}

// const apiUrl = "/api";

// document.addEventListener("DOMContentLoaded", () => {
//   loadCategories();
//   loadSources();
//   loadNews();

//   const newsForm = document.getElementById("news-form");
//   const categoryForm = document.getElementById("category-form");
//   const sourceForm = document.getElementById("source-form");

//   newsForm.addEventListener("submit", handleNewsSubmit);
//   categoryForm.addEventListener("submit", handleCategorySubmit);
//   sourceForm.addEventListener("submit", handleSourceSubmit);
// });

// async function loadCategories() {
//   try {
//     const response = await fetch(`${apiUrl}/categories`);
//     const categories = await response.json();
//     const categorySelect = document.getElementById("categories");
//     const categoryList = document.getElementById("category-list");

//     categorySelect.innerHTML = "";
//     categoryList.innerHTML = "";

//     categories.forEach((category) => {
//       const option = document.createElement("option");
//       option.value = category._id;
//       option.textContent = category.name;
//       categorySelect.appendChild(option);

//       const listItem = document.createElement("li");
//       listItem.textContent = category.name;
//       categoryList.appendChild(listItem);
//     });
//   } catch (error) {
//     console.error("Error loading categories:", error);
//   }
// }

// async function loadSources() {
//   try {
//     const response = await fetch(`${apiUrl}/news/sources`);
//     const sources = await response.json();
//     const sourceSelect = document.getElementById("source");
//     const sourceList = document.getElementById("source-list");

//     sourceSelect.innerHTML = "";
//     sourceList.innerHTML = "";

//     sources.forEach((source) => {
//       const option = document.createElement("option");
//       option.value = source._id;
//       option.textContent = source.name;
//       sourceSelect.appendChild(option);

//       const listItem = document.createElement("li");
//       listItem.textContent = source.name;
//       sourceList.appendChild(listItem);
//     });
//   } catch (error) {
//     console.error("Error loading sources:", error);
//   }
// }

// async function loadNews() {
//   try {
//     const response = await fetch(`${apiUrl}/news`);
//     const newsItems = await response.json();
//     const newsList = document.getElementById("news-list");

//     newsList.innerHTML = "";

//     newsItems.forEach((news) => {
//       const listItem = document.createElement("li");
//       listItem.innerHTML = `
//                 <span><strong>Title:</strong> ${news.title}</span>
//                 <span><strong>Category:</strong> ${news.categories
//                   .map((c) => c.name)
//                   .join(", ")}</span>
//                 <span><strong>Source:</strong> ${news.source.name}</span>
//                 <span><strong>Rank:</strong> ${news.rank}</span>
//                 <button onclick="deleteNews('${news._id}')">Delete</button>
//             `;
//       newsList.appendChild(listItem);
//     });
//   } catch (error) {
//     console.error("Error loading news:", error);
//   }
// }

// async function handleNewsSubmit(event) {
//   event.preventDefault();

//   const formData = new FormData(event.target);

//   try {
//     const response = await fetch(`${apiUrl}/news`, {
//       method: "POST",
//       body: formData,
//     });

//     if (!response.ok) {
//       throw new Error("Failed to create news");
//     }

//     loadNews();
//     event.target.reset();
//   } catch (error) {
//     console.error("Error creating news:", error);
//   }
// }

// async function handleCategorySubmit(event) {
//   event.preventDefault();

//   const categoryName = document.getElementById("category-name").value;

//   try {
//     const response = await fetch(`${apiUrl}/categories`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ name: categoryName }),
//     });

//     if (!response.ok) {
//       throw new Error("Failed to create category");
//     }

//     loadCategories();
//     event.target.reset();
//   } catch (error) {
//     console.error("Error creating category:", error);
//   }
// }

// async function handleSourceSubmit(event) {
//   event.preventDefault();

//   const formData = new FormData(event.target);

//   try {
//     const response = await fetch(`${apiUrl}/news/sources`, {
//       method: "POST",
//       body: formData,
//     });

//     if (!response.ok) {
//       throw new Error("Failed to create source");
//     }

//     loadSources();
//     event.target.reset();
//   } catch (error) {
//     console.error("Error creating source:", error);
//   }
// }

// async function deleteNews(id) {
//   try {
//     const response = await fetch(`${apiUrl}/news/${id}`, {
//       method: "DELETE",
//     });

//     if (!response.ok) {
//       throw new Error("Failed to delete news");
//     }

//     loadNews();
//   } catch (error) {
//     console.error("Error deleting news:", error);
//   }
// }

// async function viewNews(id) {
//   try {
//     const response = await fetch(`${apiUrl}/news/${id}`);
//     if (!response.ok) {
//       throw new Error("Failed to fetch news");
//     }
//     const news = await response.json();

//     // Display the news details in a modal or a separate view
//     alert(`
//       Title: ${news.title}
//       Description: ${news.description}
//       Category: ${news.categories.map((c) => c.name).join(", ")}
//       Source: ${news.source.name}
//       Rank: ${news.rank}
//     `);
//   } catch (error) {
//     console.error("Error fetching news details:", error);
//   }
// }
