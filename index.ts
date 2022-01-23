let stations = {}
let localStations = {}
let trendingStations = {}
let activeStation = undefined

document.addEventListener('DOMContentLoaded', start)

async function start() {
    {
        const div = document.getElementById("local")
        const cn = Intl.DateTimeFormat().resolvedOptions().timeZone.split('/')[1]
        const answer = await (await fetch(`https://de1.api.radio-browser.info/json/stations/bycountry/${cn}`)).json()
        addStations(localStations, div, answer, 0)
    }

    const div = document.getElementById("trending")
    const answer = await (await fetch("https://de1.api.radio-browser.info/json/stations?limit=10&order=clicktrend")).json()
    addStations(trendingStations, div, answer, 0)
}

function clearGrid(gridName: string) {
    const grid = document.getElementById(gridName)
    grid.innerHTML = ""
}

async function search(gridName: string) {
    stations = {}
    clearGrid(gridName)

    const grid = document.getElementById(gridName)

    const input = (<HTMLInputElement>document.getElementById("input")).value
    const method = (<HTMLInputElement>document.getElementById("method")).value

    let answer: any;
    switch (method) {
        case "Country":
            answer = await (await fetch(`https://de1.api.radio-browser.info/json/stations/bycountry/${input}`)).json()
            break;
        case "Language":
            answer = await (await fetch(`https://de1.api.radio-browser.info/json/stations/bylanguage/${input}`)).json()
            break;
        case "Name":
            answer = await (await fetch(`https://de1.api.radio-browser.info/json/stations/byname/${input}`)).json()
    }

    addStations(stations, grid, answer, 0)
}

function addStations(sts: {[name: string]: () => HTMLAudioElement}, grid: HTMLElement, answer: [{name: string, favicon: string, url: string}], start: number) {
    for (const station of answer.slice(start)) {
        if (Object.keys(sts).length > 20) {
            break
        }

        if (station.name.length > 12) {
            station.name = `${station.name.slice(0, 12)}..`
        }
        if (station.name in sts) {
            continue
        }

        let container = document.createElement("div")
        container.classList.add('container')
        let cell = document.createElement("button")
        cell.classList.add('station')
        if (station.favicon) {
            cell.style.backgroundImage = `url(${station.favicon})`
        } else {
            cell.style.background = "rgb(0,20,10)"
            cell.textContent = station.name
        }
        sts[station.name] = () => new Audio(station.url)
        cell.onclick = () => {
            if (activeStation) {
                activeStation.pause()
            }
            activeStation = sts[station.name]()
            activeStation.play()
        }
        const label = document.createElement('p')
        label.textContent = station.name
        container.appendChild(cell)
        container.appendChild(label)
        grid.appendChild(container)
    }
    if (answer.length - start > 20) {
        const next = document.createElement("button")
        next.textContent = "next"
        next.onclick = () => {
            sts = {}
            clearGrid(grid.id)
            addStations(sts, grid, answer, start + 20)
        }
        grid.appendChild(next)

    }
    if (start >= 20) {
        const back = document.createElement("button")
        back.textContent = "back"
        back.onclick = () => {
            sts = {}
            clearGrid(grid.id)
            addStations(sts, grid, answer, start - 20)
        }
        grid.appendChild(back)
    }
}
