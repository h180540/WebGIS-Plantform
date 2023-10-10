export default function loadAMap() {
    return new Promise(function (resolve, reject) {
      if (window.AMap) {
        resolve(window.AMap)
      } else {
        var script = document.createElement("script")
        script.type = "text/javascript"
        script.src = "https://webapi.amap.com/maps?v=1.4.15&key=e6fdbb84116fee97e090eebd95d8c0ee"
        document.head.appendChild(script)
        script.onload = () => {
          resolve(window.AMap)
        }
        script.onerror = (error) => {
          reject(error)
        }
      }
    })
  }
  