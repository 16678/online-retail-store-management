import React from "react";

const AdminDeliveryDashboard = () => {
  // Dummy stats (replace with backend data)
  const totalAgents = 12;
  const onlineAgents = 7;
  const offlineAgents = totalAgents - onlineAgents;

  const deliveries = {
    total: 152,
    assigned: 88,
    completed: 44,
    pending: 20,
  };

  const agentList = [
    { name: "Ravi Kumar", status: "Online", deliveriesAssigned: 10, deliveriesCompleted: 8 },
    { name: "Sunil Sharma", status: "Offline", deliveriesAssigned: 7, deliveriesCompleted: 5 },
    { name: "Aman Singh", status: "Online", deliveriesAssigned: 12, deliveriesCompleted: 11 },
    { name: "Priya Verma", status: "Online", deliveriesAssigned: 9, deliveriesCompleted: 6 },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6">Admin Delivery Dashboard</h1>

      {/* Agent Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <DashboardCard title="Total Agents" value={totalAgents} />
        <DashboardCard title="Online Agents" value={onlineAgents} bg="bg-green-100" />
        <DashboardCard title="Offline Agents" value={offlineAgents} bg="bg-red-100" />
        <DashboardCard title="Total Deliveries" value={deliveries.total} bg="bg-yellow-100" />
      </div>

      {/* Delivery Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <DashboardCard title="Assigned" value={deliveries.assigned} bg="bg-blue-100" />
        <DashboardCard title="Completed" value={deliveries.completed} bg="bg-green-100" />
        <DashboardCard title="Pending" value={deliveries.pending} bg="bg-orange-100" />
      </div>

      {/* Agent Table */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-2xl font-bold mb-4">Agent-wise Delivery Status</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Agent Name</th>
                <th className="p-2">Status</th>
                <th className="p-2">Assigned</th>
                <th className="p-2">Completed</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {agentList.map((agent, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2">{agent.name}</td>
                  <td className="p-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        agent.status === "Online"
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {agent.status}
                    </span>
                  </td>
                  <td className="p-2">{agent.deliveriesAssigned}</td>
                  <td className="p-2">{agent.deliveriesCompleted}</td>
                  <td className="p-2">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">
                      Assign/Reassign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Reusable Dashboard Card component
const DashboardCard = ({ title, value, bg = "bg-white" }) => (
  <div className={`${bg} p-4 rounded-2xl shadow`}>
    <h2 className="text-xl font-semibold">{title}</h2>
    <p className="text-3xl mt-2">{value}</p>
  </div>
);

export default AdminDeliveryDashboard;
