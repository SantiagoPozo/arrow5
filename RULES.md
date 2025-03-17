# Arrow 5: A Spies Game

## Operation Rules

### 0. Background:
Two secret agencies are in a race against time. Each agent's mission is to decipher the enemy's **code**. With every **attack**, codes and hints are exchanged.

### 1. Preparation
- The **initial agent** is chosen. The initial agent attacks first in each round.
- **Code:** Each agent selects a secret code of 5 **characters** without repetition from the following:
<pre>                             0 1 2 3 4 5 6 7 8 9 👁</pre>
For example:
|         |   Agent A    |   Agent B   |
|:-------:|:------------:|:-----------:|
| **Code**| `5 0 1 👁 2` | `1 0 3 6 9` |

The objective is to discover the opponent's code first.

### 2. Gameplay
Each **round** consists of two attacks and their respective responses. First, the _initial agent_ attacks and receives a response. Then the second agent attacks.  
The **end** is triggered when an agent deciphers the code. At that point, the current round ends and the game is over. This means that if the _initial agent_ is the first to discover the opponent's code, the opponent still has one final opportunity to decipher it. However, if the second agent is the first to decipher the code, they automatically win.  
If both agents decipher the code, the game ends in a tie. Otherwise, the agent who deciphers the code wins.

### 3. Attack
An attack consists of an attempt to decipher the code. The attacking player composes a message consisting of 5 characters. For example:
`5 1 3 9 4`.

### 4. Enemy Response: The Signal
The opposing agent's response is called the **signal**: it is a sequence of hints, considering only the **relevant characters** (i.e., those that appear in their code). The hints are given from left to right (following the order in which they appear in the signal) and can be one of the following:
- **"<" (backtrack):** The character must move to the left.
- **"·" (steady):** The character is in its correct position.
- **">" (advance):** The character must move to the right.
- Each character in the signal reveals the presence of a **relevant** character.

**Example of an attack.**
- `1 0 3 6 9`  &nbsp;**Secret Code**  
- `5 1 3 9 4`  &nbsp;**Attack**  
- `< · >`      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**Received Signal**

**How is the response formulated?**  
The defending agent notes that the relevant characters are `1`, `3`, and `9`. Only these are considered. The defending agent formulates a _signal_ in response. Let’s step into the mind of the defending agent and see how they think:
- `5` is not in my code. No information is provided for this character.
- `1` is in my code, but it appears earlier. Mark it as `<`.
- `3` is in my code and is in the correct position. Mark it as `·`.
- `6` is not present.
- `9` is in my code, but it appears later. Mark it as `>`.
Finally, the defending agent declares: "backtrack, steady, advance". The attacker receives `< · >`.

- An experienced agent can deduce many things from this specific signal:
	- That `5` is not in the secret code because it cannot be backtracked. (5 is irrelevant.)
	- That `4` is not in the secret code because it cannot advance.
	- Therefore, the three *relevant* characters are the central ones: `1 3 9`.
	- ...
	- Thus, the code must have the form `1 _ 3 _ 9`.

**Example of a complete game by an agent.**

| **Code**   |         1 0 3 6 9           | **Signal** |
|:----------:|:---------------------------:|:----------:|
| **Attack 1** | _0_ 5 7 _9_ 2             | `> >`      |
| **Attack 2** | _6_  __0__ 👁 _3_  _1_    | `> · < <`  |
| **Attack 3** | _3_  __0__  _6_  _1_ 👁   | `> · > <`  |
| **Attack 4** | *6* **0 3** *1* **9**     | `> · · < ·`|
| **Attack 5** | **1 0 3 6 9**             | `· · · · ·`|

**Explanation for Attack 1.**  
The defending agent reviews the attack: `0 5 7 9 2`  
The **relevant** characters are `0` and `9`. The defender will provide only two hints.
- `0` appears in the secret code, but not in the first position; it appears in the second. The agent marks `>`.
- `9` appears, but one position later. The agent marks `>`.
- The defending agent declares the signal as `advance advance`: `> >`.

In the game, this process is automated. The attacker cannot know that `0` and `9` are the relevant characters at that moment.

### 5. The Hidden Eye Variant
In the "hidden eye" variant, if a code contains the eye symbol, it remains invisible; that is, no information is ever provided about it.  
Only if an attack is perfect is it indicated that the code has been deciphered.

---

Good luck, agent!
