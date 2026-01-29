const token = import.meta.env.VITE_GITHUB_TOKEN;

async function getRequest(url) {
  const request = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return request;
}

try {
  const elForm = document.querySelector(".main__form");
  function getResponse(url) {
    showLoad(1);
    showWarning(0);
    const result = document.querySelector(".main__result-profile");
    result.innerHTML = "";
    const responseData = getRequest(url)
      .then((response) => {
        workData(response);
      })
      .catch((error) => {
        showLoad(0);
        showWarning(1);
        elForm.reset();
        throw new Error(error);
      });
  }
  function showLoad(index) {
    const load = document.querySelector(".main__loader");
    if (index) {
      load.classList.remove("none");
      load.classList.add("load");
    } else {
      load.classList.add("none");
      load.classList.remove("load");
    }
  }

  function showWarning(index, text) {
    const warning = document.querySelector(".main__warning");
    if (index) {
      warning.classList.remove("none");
    } else {
      warning.classList.add("none");
    }
  }

  function workData(response) {
    showLoad(0);
    const result = document.querySelector(".main__result-profile");
    const {
      avatar_url,
      blog,
      company,
      created_at,
      email,
      followers,
      following,
      id,
      location,
      login,
      public_gists,
      public_repos,
      updated_at,
    } = response.data;
    result.innerHTML = `
      <img
            class="main__result-img"
            src="${avatar_url}"
            alt="profile-img"
          />
          <div class="main__result-pr-r">
            <div class="main__result-pr-b">
              <p class="main__result-pr-rt">
                company: <span class="main__result-rst">${company}</span>
              </p>
              <p class="main__result-pr-rt">
                created at:
                <span class="main__result-rst">${created_at}</span>
              </p>
              <p class="main__result-pr-rt">
                email: <span class="main__result-rst">${email}</span>
              </p>
            </div>

            <div class="main__result-pr-b">
              <p class="main__result-pr-rt">
                followers: <span class="main__result-rst">${followers}</span>
              </p>
              <p class="main__result-pr-rt">
                following: <span class="main__result-rst">${following}</span>
              </p>
            </div>
            <div class="main__result-pr-b">
              <p class="main__result-pr-rt">
                location: <span class="main__result-rst">${location}</span>
              </p>
              <p class="main__result-pr-rt">
                repos: <span class="main__result-rst">${public_repos}</span>
              </p>
            </div>
            <button class="main__result-view">view more</button>
          </div>
    `;
    const elMainView = document.querySelector(".main__result-view");
    elMainView.addEventListener("click", (e) => {
      window.open(`${response?.data?.html_url}`, "_blank");
    });
  }

  elForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputValue = elForm["form-input"].value.trim().toLowerCase();
    if (inputValue) {
      const api = `https://api.github.com/users/${inputValue}`;
      getResponse(api);
    }
  });
} catch (error) {
  throw new Error(error);
}
