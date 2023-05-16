# InWorld.ai Example

This is an example scene to create AI NPCs backed by [InWorlds.ai](https://inworld.ai/arcade) service

Deployed here 

Zone (InworldAiSdk6.dcl.eth)
[ https://play.decentraland.org/?realm=https%3A%2F%2Fworlds-content-server.decentraland.zone%2Fworld%2Finworldaisdk6.dcl.eth](https://play.decentraland.org/?realm=https%3A%2F%2Fworlds-content-server.decentraland.zone%2Fworld%2Finworldaisdk6.dcl.eth)

## Configuration

NOTE: In an attempt to make playing the scene locally PLAYFAB_ENABLED is by default set to false in the Scene and Colyseus making so you can play locally with no external services configure (do not need a PlayFab account to test it out).  To enable playfab follow the instructions below.

### Scene

You may want to configure endpoints for your local environment in the instance where you do not want or need to run Colyseus and login server locally

Found in `src/config.ts` there are variables in the following format so you could have configurations for multiple environments

```
const VARIABLE: Record<string, string> = {
  local: "local value",
  dev: "dev value",
  stg: "staging value",
  prd: "production value",
};
```

`ENV` - The environment for which values are to be used (local,dev,prod,etc.)

`COLYSEUS_ENDPOINT_URL` - Websocker endpoint

## Try it out

#### Run Colyseus (Multiplayer server) (seperate tab)

Instructions here [https://github.com/decentraland-scenes/inworlds-colyseus-proxy-service#readme](https://github.com/decentraland-scenes/inworlds-colyseus-proxy-service#readme)

**Install the CLI**

Download and install the Decentraland CLI by running the following command:

```bash
npm i -g decentraland
```

**Previewing the scene**

Download this example and navigate to its directory, then run:

```
$:  dcl start
```

Any dependencies are installed and then the CLI opens the scene in a new browser tab.

**Scene Usage**

Click on the NPC to start a conversation, use E and F keys to choose options when prompted.

Learn more about how to build your own scenes in our [documentation](https://docs.decentraland.org/) site.

If something doesn’t work, please [file an issue](https://github.com/decentraland-scenes/Awesome-Repository/issues/new).


## Copyright info

This scene is protected with a standard Apache 2 licence. See the terms and conditions in the [LICENSE](/LICENSE) file.
