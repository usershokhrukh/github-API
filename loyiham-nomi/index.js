const token = import.meta.env.VITE_GITHUB_TOKEN;

async function getRequest(url) {
  const request = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return request;
}
async function getRepos(url) {
  const request = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return request;
}

try {
  const elForm = document.querySelector(".main__form");
  function getResponse(url, reposUrl, username) {
    showLoad(1);
    showWarning(0);
    const result = document.querySelector(".main__result-profile");
    result.innerHTML = "";
    const reposResult = document.querySelector(".main__result");
    reposResult.innerHTML = "";
    if (localStorage.getItem(`${username}`)) {
      const responseLocal = JSON.parse(localStorage.getItem(`${username}`));
      workData(responseLocal);

      if (localStorage.getItem(`${username}-repos`)) {
        analysisRepos(
          JSON.parse(localStorage.getItem(`${username}-repos`)).data,
        );
      } else {
        const responseReposData = getRepos(reposUrl)
          .then((response) => {
            analysisRepos(response.data);
          })
          .catch((error) => {
            showLoad(0);
            showWarning(1);
            elForm.reset();
            throw new Error(error);
          });
      }
    } else {
      const responseData = getRequest(url)
        .then((response) => {
          workData(response.data);
        })
        .catch((error) => {
          showLoad(0);
          showWarning(1);
          elForm.reset();
          throw new Error(error);
        });
      const responseReposData = getRepos(reposUrl)
        .then((response) => {
          analysisRepos(response.data);
        })
        .catch((error) => {
          showLoad(0);
          showWarning(1);
          elForm.reset();
          throw new Error(error);
        });
    }
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
  function analysisRepos(response) {
    const reposResult = document.querySelector(".main__result");
    reposResult.innerHTML = "";
    let reposArray = [];
    response?.map((item, index) => {
      const {name, watchers, full_name, html_url, description, visibility} =
        item;
      const reposObj = {
        name,
        watchers,
        full_name,
        html_url,
        description,
        visibility,
        owner: item?.owner?.login ? item?.owner?.login : item?.owner,
      };
      reposArray.push(reposObj);
      reposResult.innerHTML += `
                  <aside class="main__result-repos">
            <h2 class="main__result-repos-t">
              ${name ? name : "Not given"};
              <a href="${html_url ? html_url : "#"}" target="_blank" class="main__result-link-t">${full_name ? full_name : "Not given"}</a>
            </h2>
            <p class="main__result-respos-texts main__result-repos-pb">
              ${visibility ? visibility : "Not given"}
            </p>
            <p class="main__result-respos-texts">${description ? description : "Not given"}</p>
            <p class="main__result-respos-texts">
              <span
                ><svg
                  width="17"
                  class="main__result-repos-i"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M1.18164 12C2.12215 6.87976 6.60812 3 12.0003 3C17.3924 3 21.8784 6.87976 22.8189 12C21.8784 17.1202 17.3924 21 12.0003 21C6.60812 21 2.12215 17.1202 1.18164 12ZM12.0003 17C14.7617 17 17.0003 14.7614 17.0003 12C17.0003 9.23858 14.7617 7 12.0003 7C9.23884 7 7.00026 9.23858 7.00026 12C7.00026 14.7614 9.23884 17 12.0003 17ZM12.0003 15C10.3434 15 9.00026 13.6569 9.00026 12C9.00026 10.3431 10.3434 9 12.0003 9C13.6571 9 15.0003 10.3431 15.0003 12C15.0003 13.6569 13.6571 15 12.0003 15Z"
                  ></path>
                </svg>
              </span>
              <span class="main__result-vn">${watchers ? watchers : 0}</span>
            </p>
          </aside>
      
      `;
    });
    const pushObj = {
      data: reposArray,
    };
    localStorage.setItem(
      `${response[0]?.owner?.login ? response[0]?.owner?.login : response[0].owner}-repos`,
      JSON.stringify(pushObj),
    );
  }

  function workData(response) {
    showLoad(0);
    const result = document.querySelector(".main__result-profile");
    const {
      avatar_url,
      company,
      created_at,
      email,
      followers,
      following,
      location,
      public_repos,
    } = response;
    const profileObj = {
      avatar_url: response.avatar_url,
      company: response.company,
      created_at: response.created_at,
      email: response.email,
      followers: response.followers,
      following: response.following,
      location: response.location,
      public_repo: response.public_repo,
      login: response.login,
    };
    localStorage.setItem(
      `${response.login.toLowerCase()}`,
      JSON.stringify(profileObj),
    );
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
      const reposAPI = `https://api.github.com/users/${inputValue}/repos`;
      getResponse(api, reposAPI, inputValue);
    }
  });
} catch (error) {
  throw new Error(error);
}
