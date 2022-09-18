import { awscdk } from 'projen';

const project = new awscdk.AwsCdkConstructLibrary({
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
  devDeps: [
    'aws-cdk@^2.42.0',
    'aws-cdk-lib@^2.42.0',
    'constructs@^10.0.5',
  ],
  peerDependencyOptions: {
    pinnedDevDependency: false,
  },
  projenrcTs: true,
  gitignore: [
    '.venv/',
    'app/',
    'build/',
    'cdk.out',
  ],
});

// Ignore python directories
project.addPackageIgnore('!app/handler.zip');
project.addPackageIgnore('streamlink/');
project.addPackageIgnore('build/');
project.addPackageIgnore('cdk.out');

// Python build
const buildLayer = project.tasks.addTask('build:layer', {
  exec: 'docker run -v ${PWD}/app:/output "lambci/lambda:build-python3.8" /bin/sh -c "pip install --upgrade streamlink lxml -t python/lib/python3.8/site-packages/; zip -FSrq /output/layer.zip python"',
});
const buildApp = project.tasks.addTask('build:app', {
  exec: 'cd streamlink && zip -FS ../app/handler.zip app.py',
});
project.preCompileTask.spawn(buildLayer);
project.preCompileTask.spawn(buildApp);

project.synth();
