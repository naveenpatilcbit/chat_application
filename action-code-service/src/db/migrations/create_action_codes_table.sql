CREATE TABLE action_codes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    status ENUM('ACTIVE', 'INACTIVE', 'DEPRECATED') DEFAULT 'ACTIVE',
    is_deleted BOOLEAN DEFAULT FALSE,
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uc_action_code UNIQUE (code)
);

-- Add indexes for better performance
CREATE INDEX idx_action_code_status ON action_codes(status);
CREATE INDEX idx_action_code_category ON action_codes(category); 