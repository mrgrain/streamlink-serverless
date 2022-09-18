import { awscdk, github } from 'projen';

const project = new awscdk.AwsCdkConstructLibrary({
  projenrcTs: true,
  author: 'Momo Kornher',
  authorAddress: 'mail@moritzkornher.de',
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
  release: false,
  prerelease: 'pre',
  license: 'MIT',
  name: 'streamlink-serverless',
  description: 'Streamlink as a Service',
  repositoryUrl: 'https://github.com/mrgrain/streamlink-serverless.git',
  githubOptions: {
    projenCredentials: github.GithubCredentials.fromApp(),
  },
  devDeps: [
    'aws-cdk@^2.42.0',
    'aws-cdk-lib@^2.42.0',
    'constructs@^10.0.5',
  ],
  peerDependencyOptions: {
    pinnedDevDependency: false,
  },
  gitignore: [
    '.venv/',
    'cdk.out',
  ],
});

// Ignore python directories
project.addPackageIgnore('streamlink/');
project.addPackageIgnore('cdk.out');

project.synth();
