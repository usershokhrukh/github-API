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
  function getResponse(url) {
    const responseData = getRequest(url)
      .then((response) => {
        workData(response);
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  function workData(response) {
    const result = document.querySelector(".result");
    const {avatar_url, blog, company, created_at, email, followers, following, id, location, login, public_gists, public_repos, updated_at} = response.data;
    result.innerHTML = `
       <img width="70px" height="70px" src="${avatar_url}" alt="img" />
      <p>blog: <a href="${blog}">${blog}</a></p>
      <p>company: ${company}</p>
      <p>created at: ${created_at}</p>
      <p>email: ${email} </p>
      <p>followers: ${followers}</p>
      <p>following:  ${following}</p>
      <p>id: ${id} </p>
      <p>location: ${location} </p>
      <p>login: ${login} </p>
      <p>public gists: ${public_gists} </p>
      <p>public repos: ${public_repos} </p>
      <p>Updated at: ${updated_at}</p>
    
    `;
  }

  const elForm = document.querySelector(".form");
  elForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const inputValue= elForm["form-input"].value.trim().toLowerCase();
    const api = `https://api.github.com/users/${inputValue}`
    getResponse(api);
  })
} catch (error) {
  throw new Error(error);
}
