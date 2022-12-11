import { awscdk, github } from 'projen';
import { LogoSystem } from './projenrc/LogoSystem';
import { WorkflowDockerPatch } from './projenrc/WorkflowDockerPatch';
import { WorkflowNoDockerPatch } from './projenrc/WorkflowNoDockerPatch';

const project = new awscdk.AwsCdkConstructLibrary({
  projenrcTs: true,
  author: 'Momo Kornher',
  authorAddress: 'mail@moritzkornher.de',
  cdkVersion: '2.1.0',
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
  defaultReleaseBranch: 'main',
  release: true,
  publishToPypi: {
    distName: 'streamlink-serverless',
    module: 'streamlink_serverless',
  },
  publishToNuget: {
    dotNetNamespace: 'StreamlinkServerless',
    packageId: 'StreamlinkServerless',
    iconUrl: 'https://raw.githubusercontent.com/mrgrain/streamlink-serverless/main/images/logo.png',
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
new WorkflowNoDockerPatch(project, { workflow: 'build' });
new WorkflowDockerPatch(project, { workflow: 'release' });

// jsii rosetta
project.package.addField('jsiiRosetta', {
  strict: true,
});
const rosetta = project.addTask('rosetta', { exec: 'jsii-rosetta extract' });
project.tasks.tryFind('post-compile')?.prependSpawn(rosetta);
project.addGitIgnore('.jsii.tabl.json');
project.addPackageIgnore('.jsii.tabl.json');

project.synth();
