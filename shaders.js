
/* Vertex Shader */
export const vertexShaderSrc = `

    varying vec3 vPos; 
    varying vec3 vNormal;
    varying vec2 vUv;

    void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 pos = modelViewMatrix * vec4(position, 1.0);
        vPos = pos.xyz;
        vUv = uv;

        gl_Position = projectionMatrix * pos;

    }
`
;

/* Fragment Shader */
export const fragmentShaderSrc = `

    uniform vec3 viewPosition;

    /*struct Light {
        vec3 p; //position
        vec3 c; //color
    }*/

    uniform vec3 cSun;
    uniform vec3 pSun;

    uniform vec3 cMoon;
    uniform vec3 pMoon;

    uniform vec3 cLantern;
    uniform vec3 pLantern;

    uniform vec3 cAmbient;

    uniform float SpecularFactor;

    uniform sampler2D texturee;

    varying vec3 vPos;
    varying vec3 vNormal;
    varying vec2 vUv;

    void main() {

        vec4 texColor = texture2D(texturee, vUv);
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(viewPosition - vPos); //Used for specular light

        vec3 result = cAmbient * 0.5;

        vec3 lightDir = vec3(0.0);
        vec3 reflectionDir = vec3(0.0);

        /* Sun */
        lightDir = normalize(pSun - vPos);
        reflectionDir = reflect(-lightDir, normal);
        vec3 sunDiff = max(dot(normal, lightDir), 0.0) * cSun * 0.8;
        vec3 sunSpec = pow(max(dot(viewDir, reflectionDir), 0.0), SpecularFactor) * cSun;

        result = result + sunDiff + sunSpec;

        /* Moon */
        lightDir = normalize(pMoon - vPos);
        reflectionDir = reflect(-lightDir, normal);
        vec3 moonDiff = max(dot(normal, lightDir), 0.0) * cMoon * 0.4;
        vec3 moonSpec = pow(max(dot(viewDir, reflectionDir), 0.0), SpecularFactor*10.0) * cMoon;     
        
        result = result + moonDiff + moonSpec;

        /* Lantern */
        lightDir = normalize(pLantern - vPos);
        reflectionDir = reflect(-lightDir, normal);
        vec3 lanternDiff = max(dot(normal, lightDir), 0.0) * cLantern;
        vec3 lanternSpec = pow(max(dot(viewDir, reflectionDir), 0.0), SpecularFactor*10.0) * cLantern;     
        
        result = result + lanternDiff + lanternSpec;

        //gl_FragColor = vec4(result, 1.0);
        gl_FragColor = vec4(texColor.rgb*result, texColor.a);
    }

`
;


/* Fragment Shader 2 */
export const fragmentShaderSrc2 = `

    uniform vec3 viewPosition;

    /*struct Light {
        vec3 p; //position
        vec3 c; //color
    }*/

    uniform vec3 cSun;
    uniform vec3 pSun;

    uniform vec3 cMoon;
    uniform vec3 pMoon;

    uniform vec3 cLantern;
    uniform vec3 pLantern;

    uniform vec3 cAmbient;

    uniform float SpecularFactor;

    uniform vec3 cObj;

    varying vec3 vPos;
    varying vec3 vNormal;
    varying vec2 vUv;

    void main() {

        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(viewPosition - vPos); //Used for specular light

        vec3 result = cAmbient * 0.5;

        vec3 lightDir = vec3(0.0);
        vec3 reflectionDir = vec3(0.0);

        /* Sun */
        lightDir = normalize(pSun - vPos);
        reflectionDir = reflect(-lightDir, normal);
        vec3 sunDiff = max(dot(normal, lightDir), 0.0) * cSun * 0.8;
        vec3 sunSpec = pow(max(dot(viewDir, reflectionDir), 0.0), SpecularFactor) * cSun;

        result = result + sunDiff + sunSpec;

        /* Moon */
        lightDir = normalize(pMoon - vPos);
        reflectionDir = reflect(-lightDir, normal);
        vec3 moonDiff = max(dot(normal, lightDir), 0.0) * cMoon * 0.4;
        vec3 moonSpec = pow(max(dot(viewDir, reflectionDir), 0.0), SpecularFactor*10.0) * cMoon;     
        
        result = result + moonDiff + moonSpec;

        /* Lantern */
        lightDir = normalize(pLantern - vPos);
        reflectionDir = reflect(-lightDir, normal);
        vec3 lanternDiff = max(dot(normal, lightDir), 0.0) * cLantern;
        vec3 lanternSpec = pow(max(dot(viewDir, reflectionDir), 0.0), SpecularFactor*10.0) * cLantern;     
        
        result = result + lanternDiff + lanternSpec;

        gl_FragColor = vec4(result*cObj, 1.0);
    }

`
;