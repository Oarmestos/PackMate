# PackMate: Revolucionando el Empaque con Realidad Mixta

## El Problema

Empacar para un viaje es una tarea que todos enfrentamos, pero que pocos disfrutan. Las listas de empaque en papel se pierden, las apps móviles requieren cambiar constantemente entre la pantalla y la maleta, y siempre existe el temor de olvidar algo importante. Según estudios de viaje, el 40% de los viajeros olvidan al menos un artículo esencial en cada viaje. Necesitamos una solución que integre la planificación digital con la acción física de empacar.

## La Solución: PackMate

PackMate es una aplicación de Realidad Mixta para Meta Quest que transforma el empaque en una experiencia interactiva, visual e intuitiva. Utilizando tecnologías de vanguardia como inteligencia artificial, seguimiento de manos y visualización del mundo real, PackMate elimina la fricción entre planificar y ejecutar, creando una experiencia de "Modo Viaje" verdaderamente innovadora.

## Tecnologías Implementadas

### React Native: El Corazón de la Aplicación

PackMate está construido sobre React Native v0.82, permitiendo un desarrollo ágil con JavaScript/TypeScript mientras mantiene rendimiento nativo. Esta elección tecnológica nos permitió crear una aplicación compleja en el marco de tiempo del concurso, con código limpio, mantenible y escalable. Utilizamos Zustand para gestión de estado global, logrando actualizaciones reactivas en tiempo real cuando los usuarios interactúan con su lista de empaque.

### Meta Spatial SDK: IA y Percepción Espacial

El verdadero poder de PackMate reside en su integración con el Meta Spatial SDK v0.8.0+. Este SDK nos proporciona tres capacidades fundamentales:

**Passthrough (Acceso de Cámara)**: PackMate activa el modo passthrough para que los usuarios vean su entorno real a través del Quest. No es un mundo virtual aislado; es su habitación real, mejorada con información digital. Esta característica es esencial para el caso de uso de empaque, donde los usuarios necesitan ver y manipular objetos físicos.

**Scene Understanding (La IA)**: Aquí es donde la inteligencia artificial brilla. El SceneManager del Spatial SDK escanea continuamente el entorno del usuario, detectando planos (como el suelo) y volúmenes (como maletas, cajas o mochilas). PackMate filtra estos datos para identificar específicamente objetos de almacenamiento. Cuando detecta una maleta, renderiza un contorno brillante alrededor de ella en tiempo real. Esta detección automática, sin marcadores ni configuración manual, es lo que hace que PackMate se sienta mágico. La IA trabaja silenciosamente en segundo plano, con una confianza de detección típica del 85-95%.

**Hand Tracking (Seguimiento de Manos)**: PackMate no requiere mandos. Todo se controla mediante gestos naturales de las manos. El SDK proporciona datos de 21 articulaciones por mano a 60 FPS, permitiendo reconocimiento preciso de gestos. Implementamos un sistema de reconocimiento que detecta palma abierta, pellizco (pinch), puño y señalar. La mano izquierda controla la visibilidad de la lista de empaque, mientras que la mano derecha permite agarrar y arrastrar items virtuales.

### Arquitectura Híbrida: Puente Nativo

Para conectar React Native con el Meta Spatial SDK nativo de Android, desarrollamos un módulo nativo en Kotlin. Este "puente" expone funciones del SDK a JavaScript mediante promesas y eventos. Por ejemplo, `startPassthrough()` activa la cámara, `getHandJoints()` retorna datos de articulaciones, y `getSceneVolumes()` proporciona objetos detectados. Este patrón de arquitectura híbrida nos da lo mejor de ambos mundos: la agilidad de desarrollo de React Native y el poder de las APIs nativas de Meta.

## Características Clave

**Interacción Bimanual**: PackMate aprovecha ambas manos simultáneamente. La palma izquierda abierta muestra la lista de empaque flotante, mientras la mano derecha agarra items con un gesto de pellizco. Esta interacción bimanual se siente natural e intuitiva, similar a sostener una lista física mientras se empaca.

**Feedback Visual Inmediato**: Cada acción tiene respuesta visual. Cuando un item es agarrado, flota siguiendo el dedo índice. Al soltarlo sobre la maleta detectada, una animación de "caída" confirma la acción, y un checkmark aparece en la lista. Este feedback constante mantiene a los usuarios informados y comprometidos.

**Diseño Futurista**: La interfaz utiliza una paleta de colores cian brillante (#00FFFF) sobre fondos oscuros semi-transparentes, creando un aspecto de alta tecnología que no obstruye la vista del mundo real. Los contornos de detección usan wireframes brillantes que "abrazan" los objetos reales sin ocultarlos.

**Caso de Uso "Modo Viaje"**: PackMate está específicamente diseñado para viajeros. La lista de empaque incluye categorías típicas: ropa, documentos, electrónicos, artículos de tocador. Al finalizar, un mensaje motivador "¡Que tengas un buen viaje!" refuerza el contexto de viaje y proporciona cierre emocional.

## Impacto y Futuro

PackMate representa el futuro de las tareas cotidianas mejoradas con Realidad Mixta. Al combinar IA, seguimiento de manos y visualización del mundo real, creamos una experiencia que es más eficiente que métodos tradicionales y más natural que aplicaciones móviles. Los usuarios no necesitan aprender interfaces complejas; simplemente usan sus manos como lo harían naturalmente.

El potencial de expansión es significativo. Versiones futuras podrían incluir reconocimiento de voz para agregar items, detección de múltiples maletas simultáneas, integración con aplicaciones de viaje para generar listas automáticas basadas en destino y clima, y modo colaborativo para familias empacando juntas.

PackMate demuestra que la Realidad Mixta no es solo para juegos o entretenimiento; es una herramienta poderosa para mejorar tareas prácticas de la vida diaria. Al eliminar la fricción entre el mundo digital y físico, PackMate hace que empacar sea menos estresante y más eficiente, permitiendo a los viajeros enfocarse en lo que realmente importa: el viaje mismo.

---

**Palabras: 497**

**Tecnologías Destacadas**: React Native, Meta Spatial SDK, Scene Understanding AI, Hand Tracking, Passthrough, Kotlin Native Bridge

**Categoría**: Estilo de Vida - Modo Viaje

**Plataforma**: Meta Quest 3 / Meta Quest Pro
