# Arrow 5: Un juego de Espías
## Reglas de la Operación
### 0. Trasfondo:
Dos agencias secretas están en una carrera contrarreloj. Cada agente tiene la misión de descifrar la **clave** del enemigo. Con cada **ataque** se intercambian códigos y pistas.
### 1. Preparación
- Se elige el **agente inicial**. El agente inicial ataca primero en cada ronda.
-  **Clave:** Cada agente elige una clave secreta de 5 **caracteres** sin repetir de entre los siguientes:
<pre>                             0 1 2 3 4 5 6 7 8 9 👁</pre>
Por ejemplo:
|       |  Agente A     | Agente B
:------:|:-------------:|:------------:
  Clave | `5 0 1 👁 2`  | `1 0 3 6 9`

El objetivo es descubrir la clave del oponente primero.
### 2. Desarrollo
Cada **ronda** consiste en dos ataques y sus respectivas respuestas. Primer ataca el _agente inicial_ y recibe la respuesta. Luego ataca el segundo agente. 
El **final** se desencadena cuando un agente descifra la clave. Entonces se termina la ronda en curso y el juego termina. Esto significa que si es el _agente inicial_ el primero en descubrir la clave del rival, el rival tiene aún una oportunidad de descifrar la clave. En cambio, se el segundo agente es el primero en descifrar la clave, hagrá ganado automáticanete. 
Si ambos agentes han descifrado la clave, hay empate. En otro caso, gana el agente que ha descifrado la clave.
### 3. Ataque
Un ataque consiste en un intento de descifrar la clave. El jugador atacante elabora un mensaje que consta de 5 caracteres. Por ejemplo:
`5 1 3 9 4`.
### 4. Respuesta del Enemigo: la señal.
La respuesta del agente rival se llama **señal:** La señal es una secuencia de pistas, considerando solo los **caracteres relevantes**, es decir, los que aparecen en su clave. Las pistas se dan de izquierda a derecha (según el orden de aparición en la señal) y puede ser una de las siguientes:
-  **"<" (retroceso):** La cifra debe moverse hacia la izquierda.
-  **"·" (firme):** La cifra está en su sitio.
-  **">" (avance):** La cifra debe moverse hacia la derecha.
- Cada carácter en la señal revela la existencia de un carácter **relevante**.

**Ejemplo de un ataque.**
-  `1 0 3 6 9`  &nbsp;**Clave Secreta**
-  `5 1 3 9 4`  &nbsp;**Ataque**
-  `< · >`      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**Señal recibida**

**¿Cómo se elabora la respuesta?**
El agente defensor observa que los caracteres relevantes son `1`, `3` y `9`. Solo de estos se da información. El agente defensor elabora una _señal_ de respuesta. Entremos en la mente del agente defensor y veamos cómo piensa:
- `5` no está en mi número. No doy información sobre este número.
- `1` sí está en mi número, pero aparece antes. `<`.
- `3` sí está en mi número y está en la mism posición. Apunta `·`.
- `6` no está.
- `9`está en mi número, pero aparece después. Anota `>`.
Finalmente, el agente defensor declara: "`retroceso, firme, avence`". El atacante apunta `< · >`.

- Un agente experimentado puede deducir muchas cosas a partir de esta señal concreta:
	- Que `5` no está en la clave secreta porque no puede retroceder. (5 es irrelevante).
	- Que `4` no está en la clave secreta porque no puede avanzar.
	- Que, por tanto, las tres cifras *relevantes* son las centrales: `1 3 9`.
	- ...
	- La clave tiene que tener la forma `1 _ 3 _ 9`.

**Ejemplo de la partida completa de un agente.**

| Clave    |&nbsp;&nbsp; 1 0 3 6 9 &nbsp;&nbsp;| Señal |
|:--------:|:--------------------:|:---------|
|Ataque 1  | _0_ 5 7 _9_ 2 | `> >` |
|Ataque 2 | _6_  __0__ 👁 _3_  _1_ | `> · < <` |
|Ataque 3 | _3_  __0__  _6_  _1_ 👁 | `> · > <` |
|Ataque 4 | *6* **0 3** *1* **9** | `> · · < ·` 
|Ataque 5 | **1 0 3 6 9** |`· · · · ·` |

**Explicación del ataque 1.**
El agente defensor revisa el ataque: `0 5 7 9 2`
Las cifras **relevantes** son `0`  y `9`. El defensor solo dará dos pistas.
- El 0 aparece en el número secreto, pero no en la primera posición, si no en la segunda. El agente apunta `>`.
- El 9 aparece, pero una posición más tarde. El agente apunta `>`.
- El agente defensor declara que la señal es `avance avance`: `> >`.

En el juego, este proceso está automatizado. 
El atacante no puede saber que 0 y 9 son las cifras relevantes de momento.
### 5. Variante del ojo oculto.
En la variante del "ojo oculto", si una clave tiene ojo, este es invisible, es decir, nunca se da información sobre él.
Solo si un ataque es perfecto, se informa de que la clave ha sido descifrada.
- - - - - - - - - - - - - - -
¡Buena suerte, agente!