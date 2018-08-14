const fs = require('fs');

const mockResponseFromGiterate = [
  {
    login: "mmcknett",
    site_admin: false
  },
  {
    login: "indexzero",
    site_admin: true
  }
];

const tfMemberFromGithubMember = ({ login,  site_admin }) => ({
  username: login,
  role: site_admin ? "admin" : "member"
});

const makeMemberResourceString = (githubMember) => {
  const { username, role } = githubMember;
  const resourceString = `
###
## Assign ${username} to organization
###
resource "github_membership" "${username}_user_membership" {
    username = ${username}
    role = ${role}
}
`;
  return resourceString;
};


let tfFileOutput =
`###
## <1> The two properties that need to be set are \`token\` and \`organization\`. You can hardcode them right in
##     this provider block (very unrecommended) but the better option is to set the \`GITHUB_TOKEN\` 
##     and \`GITHUB_ORGANIZATION\` environment variables. Terraform will see those and configure the provider with them.
###
provider "github" { }
`;

mockResponseFromGiterate.forEach(githubMember => console.log(makeMemberResourceString(tfMemberFromGithubMember(githubMember))));

tfFileOutput = mockResponseFromGiterate.reduce(
  (output, githubMember) => output + makeMemberResourceString(tfMemberFromGithubMember(githubMember)),
  tfFileOutput);

fs.writeFile('./output/addMembers.tf', tfFileOutput);
