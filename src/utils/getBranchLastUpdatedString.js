export default function getBranchLastUpdatedString(owner, repo, branch, token) {
  return fetch(
    `https://api.github.com/repos/${owner}/${repo}/branches/${branch}`,
    {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  )
    .then((res) => (res.status === 200 ? res.json() : {}))
    .then((data) =>
      data.commit ? getHowLongAgoString(data.commit.commit.author.date) : ''
    );
}

const getHowLongAgoString = (timestamp) => {
  const date = new Date(timestamp);
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + ' years ago';
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + ' months ago';
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + ' days ago';
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + ' hours ago';
  }
  interval = seconds / 60;
  return Math.floor(interval) + ' minutes ago';
};
