const container = document.querySelector(".container");
const resultado = document.querySelector("#resultado");
const formulario = document.querySelector("#formulario");
const selectPais = document.querySelector("#pais");
const selectCiudad = document.querySelector("#ciudad");

window.addEventListener("load", () => {
	getPaisesAPI();
	formulario.addEventListener("submit", listenFormulario);
	selectPais.addEventListener("change", getCiudadesAPI);
});

function getCiudadesAPI(e) {
	url = "js/datos/ciudades.json";
	fetch(url)
		.then((response) => response.json())
		.then((datos) => llenarCiudades(datos, e.target.value));
}

function getPaisesAPI() {
	url = "js/datos/paises.json";
	fetch(url)
		.then((response) => response.json())
		.then((data) => llenarPaises(data))
		.catch((err) => {
			console.log(err);
		});
}

function llenarPaises(datos) {
	Object.entries(datos).forEach(([value, pais]) => {
		const option = document.createElement("option");
		option.textContent = pais;
		option.value = value;
		selectPais.appendChild(option);
	});
}

function llenarCiudades(ciudadesJSON, pais) {
	clearCiudades();
	ciudades = ciudadesJSON[pais];
	ciudades.sort().forEach((ciudad) => {
		const option = document.createElement("option");
		option.textContent = ciudad;
		option.value = ciudad;
		selectCiudad.appendChild(option);
	});
}

function clearCiudades() {
	while (selectCiudad.childElementCount > 1)
		selectCiudad.childNodes[2].remove();
	selectCiudad.selectedIndex = 0;
}

function listenFormulario(e) {
	e.preventDefault();

	const ciudad = e.target.ciudad.value;
	const pais = e.target.pais.value;
	if (ciudad === "" || pais === "") {
		mostrarError();
		return;
	}

	// Consulta la api
	consultarAPI(ciudad, pais);
}

function consultarAPI(ciudad, pais) {
	//
	const apikey = "417fd4db97c07f7b4e698eed2518e85f";
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${apikey}`;
	fetch(url)
		.then((response) => response.json())
		.then((datos) => {
			if (datos.cod !== "404") {
				spinner();
				setTimeout(() => {
					mostrarHTML(datos);
				}, 1000);
			} else mostrarError("Ciudad no Encontrada", 5000);
		})
		.catch((err) => {
			console.log(err);
		});
}

function mostrarHTML(datos) {
	let {
		name,
		main: { temp, temp_max, temp_min },
	} = datos;
	temp -= 273.15;
	temp_max -= 273.15;
	temp_min -= 273.15;

	const nombreCiudad = document.createElement("p");
	nombreCiudad.textContent = `Clima en: ${name}`;
	nombreCiudad.className = "font-bold text-2xl";

	const actual = document.createElement("p");
	actual.innerHTML = `${parseFloat(temp).toPrecision(4)} &#8451;`;
	actual.className = "font-bold text-6xl";
	const resultadoDIV = document.querySelector("#resultado");
	resultadoDIV.classList.add("text-center", "text-white");

	const max = document.createElement("p");
	max.innerHTML = `Máxima: ${parseFloat(temp_max).toPrecision(4)} &#8451;`;
	max.className = "text-xl";
	const min = document.createElement("p");
	min.innerHTML = `Minima: ${parseFloat(temp_min).toPrecision(4)} &#8451;`;
	min.className = "text-xl";

	resultadoDIV.appendChild(nombreCiudad);
	resultadoDIV.appendChild(actual);
	resultadoDIV.appendChild(max);
	resultadoDIV.appendChild(min);
}

function spinner() {
	borrarTemp();
	const spinner = document.createElement("div");
	spinner.className = "lds-ripple";
	spinner.innerHTML = "<div></div><div></div>";
	resultado.appendChild(spinner);

	setTimeout(() => {
		spinner.remove();
	}, 1000);
}

function borrarTemp() {
	while (document.querySelector("#resultado").firstChild)
		document.querySelector("#resultado").firstChild.remove();
}

function mostrarError(msj = "Ambos Campos son Requeridos", tiempo = 2000) {
	// verificando si ya existe una alerta
	const alerta = document.querySelector(".bg-red-100");

	// si no existe se crea una nueva
	if (!alerta) {
		const alerta = document.createElement("div");
		alerta.className =
			"bg-red-100 border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto mt-6 text-center";
		//
		alerta.innerHTML = `
        <strong class="font-bold">ERROR!</strong>
        <span class="block">${msj}</span>
    `;
		container.appendChild(alerta);

		setTimeout(() => {
			alerta.remove();
		}, tiempo);
	}
}
