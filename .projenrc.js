const { awscdk } = require('projen');
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Momo Kornher',
  authorAddress: 'mail@moritzkornher.de',
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
  name: 'streamlink-serverless',
  repositoryUrl: 'https://github.com/mail/streamlink-serverless.git',

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();