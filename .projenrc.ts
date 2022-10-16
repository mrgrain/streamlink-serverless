import { awscdk, github, JsonPatch } from 'projen';
import { LogoSystem } from './projenrc/LogoSystem';

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
    pullRequestLintOptions: {
      semanticTitleOptions: {
        types: ['feat', 'fix', 'chore', 'docs', 'ci'],
      },
    },
  },
  autoApproveUpgrades: true,
  autoApproveOptions: {
    allowedUsernames: [
      'projen-builder[bot]', // Bot account for upgrade PRs
      'mrgrain', // Auto-approve PRs of main maintainer
    ],
  },
  devDeps: [
    'aws-cdk@^2.42.0',
    'aws-cdk-lib@^2.42.0',
    'constructs@^10.0.5',
    'lodash.merge',
    '@types/lodash.merge',
  ],
  peerDependencyOptions: {
    pinnedDevDependency: false,
  },
  gitignore: [
    '.venv/',
    'cdk.out',
  ],
});

// Logos
new LogoSystem(project, {
  dirName: 'images',
  logo: {
    width: 145,
    height: 166,
    scale: 1.23,
    dx: 3,
  },
  wordmark: {
    font: {
      color: '#6F7174',
    },
    colorScheme: {
      dark: {
        color: '#f0f6fc',
      },
      light: {
        color: '#191919',
      },
    },
    size: {
      scale: 0.5,
    },
    raw: `<text y="100">
    <tspan x="210" dy="0em" font-size="80px">streamlink</tspan>
    <tspan x="210" dy="1em" font-size="50px">serverless</tspan>
</text>`,
  },
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
  JsonPatch.replace('/jobs/build/steps/8/with/path', '/superchain/work/dist'),
);
project.synth();
