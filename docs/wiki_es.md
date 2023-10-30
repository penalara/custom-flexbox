


# Guía de referencia de CustomFlexbox

Esta es la guía para usar la librería de CustomFlexbox en proyectos Angular.

La librería de CustomFlexbox usa una serie de Directivas de Angular que aplican clases de '[Flexbox CSS'](https://developer.mozilla.org/es/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox), permitiendo una configuración general, y una diferenciada por resoluciones.

Cuando hay una configuración general o que no es de una determinada resolución, se aplica por defecto cuando no hay nada específico configurado para la resolución que tiene el dispositivo del cliente en el momento de ejecución.


## Configuración por resoluciones

La librería contiene un servicio llamado **BreakPointService**, que emite, mediante un `Subject` de Angular llamado `cambioBreakPoint$`, los cambios de resolución del dispositivo que ejecuta la aplicación Angular. La resolución actual puede obtenerse de la propiedad `breakPointActual`.

Los valores de resolución, son un enumerado de strings del tipo `ResolucionesCustomFlex` y puede tener lo siguientes valores:

| Enum | String |Selector Directiva | Media Query |
|--|--| --| --|
| XSAMLL | XSmall | xs|(max-width: 599.98px)|
| SAMLL|Small  |s |(min-width: 600px) and (max-width: 959.98px)|
| MEDIUM |Medium  |m |(min-width: 960px) and (max-width: 1279.98px)|
| LARGE | Large |l |(min-width: 1280px) and (max-width: 1919.98px)|
| XLARGE| XLarge |xl |(min-width: 1920px)|

En la tabla se muestra la relación ente la clave ENUM, el valor `string`,  el código que se añadirá a los selectores de las directivas para indicar configuración de resolución, y el rango de px entre los que se encuentra la resolución.

Para añadir una configuración especifica por resolución, solo hace falta añadir el elemento de la columna selector directiva. Por ejemplo, para configurar una distribución en fila, que para resoluciones `xs` y `s` se convierta en columna, estableceríamos:

    <div customFlexbox="row" customFlexbox.s="column" 
       customFlexbox.xs="column">
	    <div></div>
	    <div></div>
	    <div></div>
	</div>



## Directiva de ordenación de contenedores por filas o columnas

La directiva con selector `customFlexbox` nos permite indicar la orientación de los contenedores (por ejemplo, elementos `<div>`).
Tiene dos posibles valores: `row` o `column`.

Con `<div customflebox='row'>`
!colocacionDicEnFila](/images/row-start-stretch.png)

Con `<div customflebox='column'>`
!colocacionDicEnFila](/images/row-start-stretch.png)

## Directiva de alineación de los contenedores

Esta directiva permite alinear los contenedores incluidos dentro de un contenedor que aplica la directiva de `customFlexbox`. El selector de esta directiva es `cFAlign`.

**Alineación de filas**
[.TODO.]

**Alineación de columnas**
[.TODO.]

Nota: puede seguirse de guía esta [web](https://tburleson-layouts-demos.firebaseapp.com/#/docs) demo de AngularFlexLayout, ya que se usan los mismos argumentos para alinear.

## Directiva de espacio entre contenedores

Esta directiva permite establecer, entre todos los elementos dentro de un contenedor, una determinada separación en pixeles.

El selector es `cFGap`. Se puede indicar con o sin el px. Ejemplos para establecer 2o pixeles entre los contenedores que estén contenidos por el contenedor que contiene la directiva:

 - `cFGap=20`
 - `cFGap="20px"`
 - `cFGap="20"`



## Directiva de aplicación de clases por resolución

Esta directiva su usa para configurar clases que añadir a los elementos del DOM de forma condicional, al igual que permite [ngClass](https://angular.io/api/common/NgClass). 

Su selector es `cfClass`, y como el resto de directivas se le añade `.` y un identificador de resolución para configurar por resoluciones.


## Directiva de espacio flexible para los contenedores

Selector que permite definir una ocupación flexible del espacio en la dirección especificada (row o column). El selector es `cFflex`.

Se configura estableciendo el número de porcentaje de que debe de ocupar cada contenedor. Ejemplo: 

    <div customFlexbox="row" >
	    <div cFflex="25"></div>
	    <div cFflex="20"></div>
	    <div cFflex></div>
	</div>

En este ejemplo, el primer div ocuparía el 25% del ancho, el segundo el 20%, y el último todo el ancho restante.

## Directiva de ordenación de contenedores

Permite indicar el orden de los contenedores, aunque este sea distinto a de especificación en la vista. Su selector es `cfOrder`.

Ejemplo:

    <div customFlexbox="column" >
	    <div id="blanco" cfOrder="2"></div>
	    <div id="negro" cfOrder="3"></div>
	    <div id="gris" cfOrder="1"></div>
	</div>

De esta forma, según sus identificadores, y alineación en columna, cuando se ejecute esta vista el orden de arriba a abajo sera: gris, blanco, negro.

## Directivas de visibilidad y ocultación de contenedores

Para ocultar contenedores se usa la directiva ´cfHide´, y para mostrarlos `cfShow`. Esto permite configuraciones contrarías según la resolución.

Observar el siguiente ejemplo:

    <div id="contenedor">
	    <div cfHide.xs></div>
	    <div cfHide cfShow.xs></div>
	    <div cFflex></div>
	</div>
	
Con esta configuración, el segundo `div` del contenedor que tiene aplicada la directiva del contenedor, solo se mostraría cuando estamos en una resolución `xs`, en cuyo caso se ocultaría solamente el primer `div` (y solo para esta resolución).


