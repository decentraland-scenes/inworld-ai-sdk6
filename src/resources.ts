import * as utils from "@dcl/ecs-scene-utils"


export const INVISIBLE_MATERIAL = new BasicMaterial()
const INVISIBLE_MATERIAL_texture = new Texture('images/transparent-texture.png')
INVISIBLE_MATERIAL.texture = INVISIBLE_MATERIAL_texture
INVISIBLE_MATERIAL.alphaTest = 1


export const RESOURCES = {
        models:{
          names:{
            
          },
          instances:{
            //outerPlaneShape:normalPlaneShape
          }
        },
        textures: {
          //sprite_sheet: spriteSheetTexture,
          transparent: INVISIBLE_MATERIAL_texture,
          dialogAtlas: new Texture('https://decentraland.org/images/ui/dark-atlas-v3.png')
        },
        materials: {
          //sprite_sheet: spriteSheetMaterial
          transparent: INVISIBLE_MATERIAL,
          /*emissiveBoxMat: emissiveBoxMat,
          emissiveBoxMatOutline: emissiveBoxMatOutline,
          outerBoxMat: emissiveBoxMat,
          rabbitCheckPoints: emissiveGreenMat*/
        },
        strings:{
           
        },
        images:{
          portrait:{
          },
        }
}