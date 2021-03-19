#!/bin/bash

# Register Runner
docker run --rm -v /srv/gitlab-runner/config:/etc/gitlab-runner gitlab/gitlab-runner register \
    --non-interactive \
    --executor "docker" \
    --docker-image ${DOCKER_IMAGE} \
    --url "https://gitlab.com/" \
    --registration-token ${REGISTRATION_TOKEN} \
    --name ${RUNNER_NAME} \
    --tag-list ${TAG_LIST} \
    --run-untagged="true" \
    --locked="false" \
    --docker-privileged true \
    --access-level="not_protected"

# Start Runner
docker run -d --name gitlab-runner --restart always \
    -v /srv/gitlab-runner/config:/etc/gitlab-runner \
    -v /var/run/docker.sock:/var/run/docker.sock \
    gitlab/gitlab-runner:latest

# Check Status Job
sed '/Job succeeded\|Failed to process runner/q' <( docker logs gitlab-runner -f 2>&1)