package iuh.fit.backend.model.enums;

public enum RoomStatus {
    OPEN("Open"),              // Chatting with bot
    PENDING("Pending"),        // Requested human support, waiting for manager
    ASSIGNED("Assigned"),      // Manager accepted and providing support
    CLOSED("Closed");          // Chat session ended

    private final String displayName;
    
    RoomStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
