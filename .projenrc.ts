import { awscdk, github, JsonPatch } from 'projen';

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

// Fix Docker on GitHub
const buildWorkflow = project.tryFindObjectFile('.github/workflows/build.yml');
buildWorkflow?.patch(
  JsonPatch.add('/jobs/build/defaults', { run: { 'working-directory': '/superchain/work' } }),
  JsonPatch.add('/jobs/build/container/options', '--group-add 121'),
  JsonPatch.add('/jobs/build/container/volumes', ['/superchain:/superchain']),
  JsonPatch.add('/jobs/build/env/TMPDIR', '/superchain/tmp'),
  JsonPatch.add('/jobs/build/steps/1', {
    'name': 'Prepare Workspace',
    'working-directory': '/superchain',
    'run': 'sudo cp -a $GITHUB_WORKSPACE/. /superchain/work/ && sudo install -d -m 0777 -o superchain -g superchain /superchain/tmp',
  }),
  JsonPatch.replace('/jobs/build/steps/5/with/path', '/superchain/work/.repo.patch'),
  JsonPatch.replace('/jobs/build/steps/7/with/path', '/superchain/work/dist'),
);
project.synth();
