document.addEventListener("DOMContentLoaded", () => {
    const events = [
        { id: 1, name: "Conference 2024", type: "conference", status: "upcoming" },
        { id: 2, name: "Workshop on AI", type: "workshop", status: "completed" },
        { id: 3, name: "Webinar: Cloud Tech", type: "webinar", status: "upcoming" },
    ];

    const typeFilter = document.getElementById("typeFilter");
    const statusFilter = document.getElementById("statusFilter");
    const columns = document.querySelectorAll(".column-body");

    // Populate columns based on status
    const renderColumns = () => {
        columns.forEach((column) => (column.innerHTML = "")); // Clear columns

        events.forEach((event) => {
            if (
                (typeFilter.value === "all" || event.type === typeFilter.value) &&
                (statusFilter.value === "all" || event.status === statusFilter.value)
            ) {
                const card = document.createElement("div");
                card.className = "event-card";
                card.draggable = true;
                card.dataset.id = event.id;
                card.innerHTML = `<h3>${event.name}</h3><p>Type: ${event.type}</p><p>Status: ${event.status}</p>`;
                card.addEventListener("dragstart", handleDragStart);
                document.getElementById(event.status).querySelector(".column-body").appendChild(card);
            }
        });
    };

    // Drag and Drop Logic
    const handleDragStart = (e) => {
        e.dataTransfer.setData("text/plain", e.target.dataset.id);
    };

    columns.forEach((column) => {
        column.addEventListener("dragover", (e) => e.preventDefault());

        column.addEventListener("drop", (e) => {
            e.preventDefault();
            const eventId = e.dataTransfer.getData("text/plain");
            const event = events.find((event) => event.id == eventId);

            if (event) {
                event.status = column.parentElement.id; // Update status
                renderColumns();
            }
        });
    });

    // Filter Logic
    typeFilter.addEventListener("change", renderColumns);
    statusFilter.addEventListener("change", renderColumns);

    renderColumns(); // Initial render
});
