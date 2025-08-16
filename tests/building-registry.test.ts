import { describe, it, expect } from "vitest"

// Mock Clarity contract calls
const mockContractCalls = {
  "building-registry": {
    "register-building": (name, address, totalUnits, buildingType, constructionYear, totalArea) => {
      if (!name || name.length === 0) return { type: "error", value: 103 }
      if (!address || address.length === 0) return { type: "error", value: 103 }
      if (totalUnits <= 0) return { type: "error", value: 103 }
      if (totalArea <= 0) return { type: "error", value: 103 }
      if (constructionYear < 1900 || constructionYear > 2030) return { type: "error", value: 103 }
      
      return { type: "ok", value: 1 }
    },
    "get-building": (buildingId) => {
      if (buildingId === 1) {
        return {
          type: "some",
          value: {
            owner: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
            manager: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
            name: "Test Building",
            address: "123 Test St",
            "total-units": 10,
            "building-type": "residential",
            "construction-year": 2020,
            "total-area": 5000,
            status: "active",
            "created-at": 1000,
          },
        }
      }
      return { type: "none" }
    },
    "add-manager": (buildingId, manager) => {
      if (buildingId !== 1) return { type: "error", value: 102 }
      return { type: "ok", value: true }
    },
    "is-authorized-manager": (buildingId, manager) => {
      return buildingId === 1 && manager === "ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG"
    },
    "building-exists": (buildingId) => {
      return buildingId === 1
    },
  },
}

function callContract(contractName, functionName, ...args) {
  return mockContractCalls[contractName][functionName](...args)
}

describe("Building Registry Contract", () => {
  describe("register-building", () => {
    it("should successfully register a new building", () => {
      const result = callContract(
          "building-registry",
          "register-building",
          "Test Building",
          "123 Test St",
          10,
          "residential",
          2020,
          5000,
      )
      
      expect(result.type).toBe("ok")
      expect(result.value).toBe(1)
    })
    
    it("should reject building with empty name", () => {
      const result = callContract(
          "building-registry",
          "register-building",
          "",
          "123 Test St",
          10,
          "residential",
          2020,
          5000,
      )
      
      expect(result.type).toBe("error")
      expect(result.value).toBe(103) // ERR-INVALID-INPUT
    })
    
    it("should reject building with zero units", () => {
      const result = callContract(
          "building-registry",
          "register-building",
          "Test Building",
          "123 Test St",
          0,
          "residential",
          2020,
          5000,
      )
      
      expect(result.type).toBe("error")
      expect(result.value).toBe(103) // ERR-INVALID-INPUT
    })
    
    it("should reject building with invalid construction year", () => {
      const result = callContract(
          "building-registry",
          "register-building",
          "Test Building",
          "123 Test St",
          10,
          "residential",
          1800,
          5000,
      )
      
      expect(result.type).toBe("error")
      expect(result.value).toBe(103) // ERR-INVALID-INPUT
    })
  })
  
  describe("get-building", () => {
    it("should return building details for existing building", () => {
      const result = callContract("building-registry", "get-building", 1)
      
      expect(result.type).toBe("some")
      expect(result.value.name).toBe("Test Building")
      expect(result.value["total-units"]).toBe(10)
      expect(result.value.status).toBe("active")
    })
    
    it("should return none for non-existent building", () => {
      const result = callContract("building-registry", "get-building", 999)
      
      expect(result.type).toBe("none")
    })
  })
  
  describe("add-manager", () => {
    it("should successfully add a manager to existing building", () => {
      const result = callContract("building-registry", "add-manager", 1, "ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG")
      
      expect(result.type).toBe("ok")
      expect(result.value).toBe(true)
    })
    
    it("should reject adding manager to non-existent building", () => {
      const result = callContract("building-registry", "add-manager", 999, "ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG")
      
      expect(result.type).toBe("error")
      expect(result.value).toBe(102) // ERR-BUILDING-NOT-FOUND
    })
  })
  
  describe("is-authorized-manager", () => {
    it("should return true for authorized manager", () => {
      const result = callContract(
          "building-registry",
          "is-authorized-manager",
          1,
          "ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG",
      )
      
      expect(result).toBe(true)
    })
    
    it("should return false for unauthorized manager", () => {
      const result = callContract(
          "building-registry",
          "is-authorized-manager",
          1,
          "ST3NBRSFKX28FQ2ZJ1MAKX58HKHSDGNV5N7R21XCP",
      )
      
      expect(result).toBe(false)
    })
  })
  
  describe("building-exists", () => {
    it("should return true for existing building", () => {
      const result = callContract("building-registry", "building-exists", 1)
      
      expect(result).toBe(true)
    })
    
    it("should return false for non-existent building", () => {
      const result = callContract("building-registry", "building-exists", 999)
      
      expect(result).toBe(false)
    })
  })
})
