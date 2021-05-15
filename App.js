import * as React from "react"
import { useEffect, useState, useContext } from "react"
import { DataGrid } from "@material-ui/data-grid"
import { TextField } from "@material-ui/core"
import { randomCreatedDate, randomTraderName, randomUpdatedDate } from "@material-ui/x-grid-data-generator"
import Axios from "axios"

const columns = [
  { field: "id", headerName: "id", type: "number", editable: true },
  { field: "firstName", headerName: "FirstName", width: 180, editable: true },
  { field: "lastName", headerName: "lastName", width: 180, editable: true },
  { field: "username", headerName: "username", width: 180, editable: true },
]

export default function App() {
  const [username, setUsername] = useState("admin")
  const [password, setPassword] = useState("admin")
  const [prevdata, setPrevData] = useState([])
  // const [filteredRows, setFilteredRows] = React.useState([...data])
  const [filteredRows, setFilteredRows] = useState([])

  async function getLogin() {
    try {
      const response = await Axios.post("https://localhost:44347/api/v1/Authorization/authenticate", { username, password })
      if (response.data) {
        localStorage.setItem("appToken", response.data.token)
        localStorage.setItem("appFirstName", response.data.firstName)
        console.log(response.data)
        const accessToken = localStorage.getItem("appToken")
        const authAxios = Axios.create({ headers: { Authorization: "Bearer " + accessToken } })
        const resp = await authAxios.get("https://localhost:44347/api/v1/Users")
        console.log(resp)
        return resp
      } else {
        console.log("Incorrect username / password.")
      }
    } catch (e) {
      console.log("There was a problem")
    }
  }

  useEffect(() => {
    getLogin().then((res) => {
      setPrevData(res.data)
      setFilteredRows(res.data)
    }, [])
  }, [])

  const onChange = (e) => {
    const { value } = e.target
    console.log(value)
    const _filtered = filteredRows.filter((row) => row.firstName.toLowerCase().includes(value.toLowerCase()))
    if (value) {
      setFilteredRows(_filtered)
    } else {
      setFilteredRows(prevdata)
    }
  }
  return (
    <div style={{ height: 300, width: "100%" }}>
      <TextField placeholder="Search" variant="outlined" onChange={onChange} />
      <div style={{ margin: 4 }}></div>
      <DataGrid rows={filteredRows} columns={columns} />
    </div>
  )
}
