const core = require('@actions/core');
const { exec } = require('@actions/exec');

async function registerRunnerCmd() {
  let cmdArgs = [];
  cmdArgs.push(`--rm`)
  cmdArgs.push(`-v`, `/srv/gitlab-runner/config:/etc/gitlab-runner`)
  cmdArgs.push(`gitlab/gitlab-runner`)
  cmdArgs.push(`register`)
  cmdArgs.push(`--non-interactive`)
  cmdArgs.push(`--executor`, `docker`)
  cmdArgs.push(`--docker-image`, core.getInput('docker-image'))
  cmdArgs.push(`--url`, `https://gitlab.com/`)
  cmdArgs.push(`--registration-token`, core.getInput('registration-token'))
  cmdArgs.push(`--name`, core.getInput('name'))
  cmdArgs.push(`--tag-list`, core.getInput('tag-list'))
  cmdArgs.push(`--docker-privileged`, true)
  cmdArgs.push(`--locked="false"`)
  cmdArgs.push(`--access-level="${core.getInput('access-level')}"`)
  cmdArgs.push(`--run-untagged="${core.getInput('run-untagged')}"`)

  await exec('docker run', cmdArgs);
}

async function unregisterRunnerCmd() {
  let cmdArgs = [];
  cmdArgs.push(`--rm`)
  cmdArgs.push(`-v`, `/srv/gitlab-runner/config:/etc/gitlab-runner`)
  cmdArgs.push(`gitlab/gitlab-runner`)
  cmdArgs.push(`unregister`)
  cmdArgs.push(`--name`, core.getInput('name'))

  await exec('docker run', cmdArgs);
}

async function startRunnerCmd() {
  let cmdArgs = []
  cmdArgs.push(`-d`)
  cmdArgs.push(`--name`, `gitlab-runner`)
  cmdArgs.push(`--restart`, `always`)
  cmdArgs.push(`-v`, `/srv/gitlab-runner/config:/etc/gitlab-runner`)
  cmdArgs.push(`-v`, `/var/run/docker.sock:/var/run/docker.sock`)
  cmdArgs.push(`gitlab/gitlab-runner`)

  await exec('docker run', cmdArgs);
}

async function stopRunnerCmd() {
  let cmdArgs = []
  cmdArgs.push(`gitlab-runner`)

  await exec('docker stop ', cmdArgs);
  await exec('docker rm ', cmdArgs);
}

async function checkJob(){
  let cmdArgs = []
  await exec(`./gitlab-runner-action/check-job.sh`)
}

async function registerRunner() {
  try{
    await registerRunnerCmd()
    await startRunnerCmd()
    await checkJob()
  }finally{
    await unregisterRunner()
  }
}

async function unregisterRunner() {
  await stopRunnerCmd()
  await unregisterRunnerCmd()
}

registerRunner()