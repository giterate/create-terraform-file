
module.exports = async function ({ org, repo, repos }) {
  const labels = await repo.labels().map(({ label }) => label);
  repos = repos || await org.repos().map(({ repo }) => repo);

  return repos.map(repo => {
    return labels.map(label => {
      return `
resource "github_issue_label" "${repo.name}" {
  repository = "${repo.name}"
  name = "${label.name}"
  color = "${label.color}"
}
`;
    }).join('');
  }).join('\n');
}
