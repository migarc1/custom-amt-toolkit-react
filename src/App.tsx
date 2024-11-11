import './App.css';
import KVM from './UI';

function App() {

  return (
    <div className="App">
        <KVM deviceId="64616825-6585-42a6-914a-b63e65b55e42" //Replace with AMT Device GUID
        mpsServer="https://amt.endpointcloudservices.intel.com/mps/ws/relay" //Replace 'localhost' with Development System or MPS Server IP Address
        mouseDebounceTime={200}
        authToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRJZCI6IiIsImlzcyI6ImFkbWluLWlzc3VlciIsImRldmljZUlkIjoiNjQ2MTY4MjUtNjU4NS00MmE2LTkxNGEtYjYzZTY1YjU1ZTQyIiwiZXhwIjoxNzMxMzU0MTQwfQ.S2XtZbTQm6ZgcZUcg6-hHFA1kE80itjdJ3-RJM4XBSA"
        canvasHeight="100%"
        canvasWidth="100%"></KVM>
    </div>
);
}

export default App
