package com.empresa.bsc.iam.dto;

import com.empresa.bsc.shared.enums.RoleType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private String id;
    private String name;
    private String email;
    private RoleType role;
    private String roleDisplay;
    private String area;
    private boolean active;
}
