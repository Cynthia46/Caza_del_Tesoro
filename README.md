🏰 Juego Caza del Tesoro 🏰 
Juego de tablero basado en navegador donde el objetivo es guiar al héroe hasta el tesoro en el menor número de tiradas posibles. La interfaz y la lógica están construidas íntegramente con JavaScript.

📋 Características.
-	Generación de Interfaz: Todo el HTML se construye dinámicamente mediante JS
-	Personalización: Registro de nombre de usuario con validación
-	Sistema de Récords: Guarda tu mejor puntuación (menor número de tiradas) en el navegador
-	Iconografía: Uso de emojis Unicode para los elementos.

🎮 Niveles de dificultad.
El juego cuenta con dos modos de juego que alteran las reglas de movimiento:
🟢 Nivel principiante
-	Mecánica: Movimiento libre hasta x casillas
-	Ejemplo: Si sacas un 5 en el dado, puedes elegir moverte 1,2,3,4 o 5 casillas en cualquier dirección válida.

🔴 Nivel experto
-	Mecánica: Movimiento exacto
-	Ejemplo: Si sacas un 5, sólo puedes moverte a la casilla que está exactamente a 5 pasos de distancia. Si esa casilla se sale del tablero, pierdes turno.

🚀 Instrucciones de ejecución
1.	Abre el archivo index.html en tu navegador
2.	Login:
    a.	Introduce un nombre (mínimo 4 letras, sin números)
    b.	Selecciona una dificultad (Principiante o Experto)
    c.	Pulsa “Introducir Nombre”
3.	Panel del saludo:
    a.	Pulsa el botón "⚔️ Jugar" para generar el tablero
4.	Juego:
    a.	Pulsa el botón 
    b.	Las casillas válidas se iluminarán en el tablero de rojo
    c.	Haz clic en una casilla iluminada para mover al héroe
5.	Fin
    a.	Al llegar al cofre, aparecerá un mensaje de victoria
    b.	Acepta el mensaje para recargar la página y jugar de nuevo.
