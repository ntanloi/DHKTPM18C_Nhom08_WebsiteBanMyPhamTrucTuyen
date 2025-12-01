package iuh.fit.backend.model.enums;

public enum RoomType {
    BOT("Bot"),
    HUMAN("Human");

    private final String displayName;
    
    RoomType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
