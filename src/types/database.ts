export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "driver" | "agent" | "operator" | "admin";
export type VehicleType = "gasoline" | "ev" | "handicap";
export type TopologyType = "oblique" | "perpendicular" | "parallel" | "wide";
export type SpaceType = "regular" | "ev" | "handicap";
export type TicketStatus = "active" | "completed" | "overdue" | "cancelled";
export type PaymentStatus = "unpaid" | "paid" | "refunded" | "waived" | "disputed" | "dismissed" | "appealed";
export type EVStatus = "available" | "charging" | "faulted" | "reserved" | "offline";
export type EVOperationalStatus = "operational" | "degraded" | "offline" | "faulted" | "maintenance";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          phone_number: string | null;
          full_name: string | null;
          avatar_url: string | null;
          wallet_balance_rwf: number;
          national_id: string | null;
          driver_license: string | null;
          emergency_contact: string | null;
          rra_tin: string | null;
          role: UserRole;
          is_active: boolean;
          phone_hash: string | null;
          email_hash: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          phone_number?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          wallet_balance_rwf?: number;
          national_id?: string | null;
          driver_license?: string | null;
          emergency_contact?: string | null;
          rra_tin?: string | null;
          role?: UserRole;
          is_active?: boolean;
          phone_hash?: string | null;
          email_hash?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      vehicles: {
        Row: {
          id: string;
          user_id: string;
          plate_number: string;
          plate_hash: string;
          masked_plate: string;
          vehicle_type: VehicleType;
          brand: string | null;
          model: string | null;
          make_model: string | null;
          color: string | null;
          body_style: string | null;
          plug_type: string | null;
          battery_capacity_kwh: number;
          battery_level_percent: number;
          handicap_permit_number: string | null;
          is_default: boolean;
          has_unpaid_arrears: boolean;
          total_arrears_rwf: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plate_number: string;
          plate_hash: string;
          masked_plate: string;
          vehicle_type?: VehicleType;
          brand?: string | null;
          model?: string | null;
          make_model?: string | null;
          color?: string | null;
          body_style?: string | null;
          plug_type?: string | null;
          battery_capacity_kwh?: number;
          battery_level_percent?: number;
          handicap_permit_number?: string | null;
          is_default?: boolean;
          has_unpaid_arrears?: boolean;
          total_arrears_rwf?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["vehicles"]["Insert"]>;
      };
      parking_locations: {
        Row: {
          id: string;
          name: string;
          address: string;
          city: string;
          country: string;
          latitude: number;
          longitude: number;
          layout_topology: TopologyType;
          total_spots: number;
          available_spots: number;
          hourly_rate: number;
          daily_rate: number;
          currency: string;
          qr_code_identifier: string;
          opening_hours: Json | null;
          facilities: string[] | null;
          image_url: string | null;
          zone_code: string | null;
          is_electric_station: boolean;
          is_handicap_facility: boolean;
          is_active: boolean;
          status: "active" | "inactive" | "maintenance";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          address: string;
          city?: string;
          country?: string;
          latitude: number;
          longitude: number;
          layout_topology?: TopologyType;
          total_spots?: number;
          available_spots?: number;
          hourly_rate?: number;
          daily_rate?: number;
          currency?: string;
          qr_code_identifier: string;
          opening_hours?: Json | null;
          facilities?: string[] | null;
          image_url?: string | null;
          zone_code?: string | null;
          is_electric_station?: boolean;
          is_handicap_facility?: boolean;
          is_active?: boolean;
          status?: "active" | "inactive" | "maintenance";
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["parking_locations"]["Insert"]>;
      };
      parking_spaces: {
        Row: {
          id: string;
          location_id: string;
          space_number: string;
          zone_code: string;
          space_type: SpaceType;
          price_per_hour_rwf: number | null;
          image_url: string | null;
          is_occupied: boolean;
          current_vehicle_id: string | null;
          current_plate_hash: string | null;
          current_vehicle_plate: string | null;
          qr_code_token: string;
          camera_device_id: string | null;
          occupied_at: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          location_id: string;
          space_number: string;
          zone_code?: string;
          space_type?: SpaceType;
          price_per_hour_rwf?: number | null;
          image_url?: string | null;
          is_occupied?: boolean;
          current_vehicle_id?: string | null;
          current_plate_hash?: string | null;
          current_vehicle_plate?: string | null;
          qr_code_token: string;
          camera_device_id?: string | null;
          occupied_at?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["parking_spaces"]["Insert"]>;
      };
      ev_charging_points: {
        Row: {
          id: string;
          location_id: string;
          space_id: string | null;
          station_identifier: string;
          connector_type: string;
          max_output_kw: number;
          max_power_watts: number;
          charging_power_watts: number;
          current_power_draw_kw: number;
          voltage_volts: number;
          amperage_amps: number;
          price_per_kwh: number;
          flat_rate_full_rwf: number;
          flat_rate_quick_rwf: number;
          quick_session_threshold_mins: number;
          parking_fee_rwf: number;
          status: EVStatus;
          is_operational: boolean;
          operational_status: EVOperationalStatus;
          fault_code: string | null;
          fault_description: string | null;
          api_provider: string | null;
          api_endpoint_url: string | null;
          api_shared_data: Json | null;
          telemetry_payload: Json | null;
          total_energy_delivered_kwh: number;
          heartbeat_interval_sec: number;
          estimated_free_at: string | null;
          image_url: string | null;
          last_heartbeat: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          location_id: string;
          space_id?: string | null;
          station_identifier: string;
          connector_type?: string;
          max_output_kw?: number;
          max_power_watts?: number;
          charging_power_watts?: number;
          current_power_draw_kw?: number;
          voltage_volts?: number;
          amperage_amps?: number;
          price_per_kwh?: number;
          flat_rate_full_rwf?: number;
          flat_rate_quick_rwf?: number;
          quick_session_threshold_mins?: number;
          parking_fee_rwf?: number;
          status?: EVStatus;
          is_operational?: boolean;
          operational_status?: EVOperationalStatus;
          fault_code?: string | null;
          fault_description?: string | null;
          api_provider?: string | null;
          api_endpoint_url?: string | null;
          api_shared_data?: Json | null;
          telemetry_payload?: Json | null;
          total_energy_delivered_kwh?: number;
          heartbeat_interval_sec?: number;
          estimated_free_at?: string | null;
          image_url?: string | null;
          last_heartbeat?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["ev_charging_points"]["Insert"]>;
      };
      parking_tickets: {
        Row: {
          id: string;
          ticket_number: string;
          user_id: string | null;
          vehicle_id: string | null;
          plate_hash: string;
          vehicle_plate: string;
          location_id: string;
          space_id: string | null;
          entry_time: string;
          exit_time: string | null;
          status: TicketStatus;
          hourly_rate: number;
          daily_cap: number;
          rate_applied: "hourly" | "daily";
          hours_elapsed: number;
          total_amount: number;
          amount_paid: number;
          payment_status: PaymentStatus;
          payment_method: string | null;
          is_flagged_by_agent: boolean;
          qr_token: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          ticket_number: string;
          user_id?: string | null;
          vehicle_id?: string | null;
          plate_hash: string;
          vehicle_plate: string;
          location_id: string;
          space_id?: string | null;
          entry_time?: string;
          exit_time?: string | null;
          status?: TicketStatus;
          hourly_rate?: number;
          daily_cap?: number;
          rate_applied?: "hourly" | "daily";
          hours_elapsed?: number;
          total_amount?: number;
          amount_paid?: number;
          payment_status?: PaymentStatus;
          payment_method?: string | null;
          is_flagged_by_agent?: boolean;
          qr_token: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["parking_tickets"]["Insert"]>;
      };
      parking_fines: {
        Row: {
          id: string;
          fine_number: string;
          vehicle_id: string | null;
          plate_hash: string;
          vehicle_plate: string;
          location_id: string | null;
          space_id: string | null;
          fine_amount: number;
          currency: string;
          reason: string;
          issued_by_agent_id: string | null;
          issued_by?: string | null;
          payment_status: PaymentStatus;
          irembo_reference_code?: string | null;
          evidence_photo_url?: string | null;
          notes?: string | null;
          issued_at: string;
          paid_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          fine_number: string;
          vehicle_id?: string | null;
          plate_hash: string;
          vehicle_plate: string;
          location_id?: string | null;
          space_id?: string | null;
          fine_amount?: number;
          currency?: string;
          reason?: string;
          issued_by_agent_id?: string | null;
          issued_by?: string | null;
          payment_status?: PaymentStatus;
          irembo_reference_code?: string | null;
          evidence_photo_url?: string | null;
          notes?: string | null;
          issued_at?: string;
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["parking_fines"]["Insert"]>;
      };
      vehicle_invoice_flags: {
        Row: {
          id: string;
          ticket_id: string;
          plate_hash: string;
          flagged_by_agent_id: string | null;
          flagged_at: string;
          overdue_amount_rwf: number;
          notification_status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          ticket_id: string;
          plate_hash: string;
          flagged_by_agent_id?: string | null;
          flagged_at?: string;
          overdue_amount_rwf: number;
          notification_status?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["vehicle_invoice_flags"]["Insert"]>;
      };
      ev_charging_sessions: {
        Row: {
          id: string;
          session_number: string;
          user_id: string | null;
          vehicle_id: string | null;
          vehicle_plate: string;
          location_id: string | null;
          charger_id: string | null;
          bay_number: string;
          charger_power_kw: number;
          initial_soc: number;
          target_soc: number;
          final_soc: number | null;
          delivered_kwh: number;
          elapsed_seconds: number;
          charging_amount_rwf: number;
          parking_amount_rwf: number;
          tariff_tier: string;
          status: "active" | "completed" | "cancelled";
          started_at: string;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          session_number: string;
          user_id?: string | null;
          vehicle_id?: string | null;
          vehicle_plate: string;
          location_id?: string | null;
          charger_id?: string | null;
          bay_number: string;
          charger_power_kw?: number;
          initial_soc?: number;
          target_soc?: number;
          final_soc?: number | null;
          delivered_kwh?: number;
          elapsed_seconds?: number;
          charging_amount_rwf?: number;
          parking_amount_rwf?: number;
          tariff_tier?: string;
          status?: "active" | "completed" | "cancelled";
          started_at?: string;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["ev_charging_sessions"]["Insert"]>;
      };
      parking_permits: {
        Row: {
          id: string;
          permit_number: string;
          user_id: string;
          vehicle_id: string | null;
          vehicle_plate: string;
          permit_title: string;
          zone_scope: string;
          issuing_authority: string;
          status: "active" | "pending" | "expired" | "revoked";
          valid_until: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          permit_number: string;
          user_id: string;
          vehicle_id?: string | null;
          vehicle_plate: string;
          permit_title: string;
          zone_scope?: string;
          issuing_authority?: string;
          status?: "active" | "pending" | "expired" | "revoked";
          valid_until?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["parking_permits"]["Insert"]>;
      };
      user_notifications: {
        Row: {
          id: string;
          user_id: string;
          category: "Parking" | "AI Radar" | "Billing" | "System";
          title: string;
          message: string;
          read: boolean;
          icon: string;
          action_text: string | null;
          action_type: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category?: "Parking" | "AI Radar" | "Billing" | "System";
          title: string;
          message: string;
          read?: boolean;
          icon?: string;
          action_text?: string | null;
          action_type?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_notifications"]["Insert"]>;
      };
      payment_methods: {
        Row: {
          id: string;
          user_id: string;
          method_type: "momo" | "airtel" | "card" | "wallet";
          provider_name: string;
          masked_identifier: string;
          is_default: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          method_type: "momo" | "airtel" | "card" | "wallet";
          provider_name: string;
          masked_identifier: string;
          is_default?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["payment_methods"]["Insert"]>;
      };
      location_reviews: {
        Row: {
          id: string;
          location_id: string;
          user_id: string;
          rating: number;
          comment: string;
          tags: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          location_id: string;
          user_id: string;
          rating: number;
          comment: string;
          tags?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["location_reviews"]["Insert"]>;
      };
    };
    Views: {
      parking_spots: {
        Row: Database["public"]["Tables"]["parking_spaces"]["Row"];
      };
    };
    Functions: {
      audit_plate_compliance: {
        Args: { p_plate_hash: string };
        Returns: Json;
      };
      check_phone_available: {
        Args: { p_phone: string };
        Returns: boolean;
      };
      resolve_login_email_by_phone: {
        Args: { p_phone: string };
        Returns: string | null;
      };
      calculate_parking_fee: {
        Args: {
          p_entry_time: string;
          p_exit_time?: string;
          p_hourly_rate?: number;
          p_daily_cap?: number;
        };
        Returns: {
          hours_billed: number;
          amount_due: number;
          rate_type: string;
        }[];
      };
      calculate_ev_charging_fee: {
        Args: {
          p_started_at: string;
          p_completed_at?: string;
          p_is_full_charge?: boolean;
          p_flat_rate_full?: number;
          p_flat_rate_quick?: number;
          p_quick_threshold_mins?: number;
        };
        Returns: {
          minutes_billed: number;
          charging_amount_rwf: number;
          parking_amount_rwf: number;
          tariff_tier: string;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
