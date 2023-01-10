# Gitlab Runner Action
This action allow you have a gitlab runner up to ~60gb

## Action Inputs

| Input Name | Description | Required | Enum Values | Default Value |
|-----------------|-------------|---------------|---------------|---------------|
| `gitlab-instance` | Gitlab instance | No | N/A | https://gitlab.com/ |
| `registration-token` | Registration token | Yes | N/A | N/A |
| `name` | Runner name | Yes | N/A | N/A |
| `tag-list` | Tag list to bind with the runner | Yes | N/A | N/A |
| `docker-image` | Docker image used by runner | No | N/A | docker:19.03.12 |
| `run-untagged` | Parameter that allows or not to pick untagged jobs" | No | true or false | true |
| `access-level` | Parameter to create or not a protected runner | No | ref_protected or not_protected | not_protected |

## Example Workflows 

Complete example with steps for cleaning space and gilab runner
```yaml
name: Gitlab Runner Service
on: [repository_dispatch]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Maximize Build Space
        uses: easimon/maximize-build-space@master
        with:
          root-reserve-mb: 512
          swap-size-mb: 1024
          remove-dotnet: 'true'
          remove-android: 'true'
          remove-haskell: 'true'

      - name: Gitlab Runner
        uses: edersonbrilhante/gitlab-runner-action@main
        with:
          registration-token: "${{ github.event.client_payload.registration_token }}"
          docker-image: "docker:19.03.12"
          name: ${{ github.run_id }}
          tag-list: "crosscicd"
```
