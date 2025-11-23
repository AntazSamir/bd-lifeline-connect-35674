-- Create donation_responses table to track donor responses to blood requests
CREATE TABLE IF NOT EXISTS donation_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES blood_requests(id) ON DELETE CASCADE,
    donor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Prevent duplicate responses from same donor to same request
    UNIQUE(request_id, donor_id)
);

-- Create index for faster queries
CREATE INDEX idx_donation_responses_request_id ON donation_responses(request_id);
CREATE INDEX idx_donation_responses_donor_id ON donation_responses(donor_id);
CREATE INDEX idx_donation_responses_status ON donation_responses(status);

-- Enable RLS
ALTER TABLE donation_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own responses
CREATE POLICY "Users can view their own responses"
    ON donation_responses
    FOR SELECT
    USING (auth.uid() = donor_id);

-- Users can view responses to their requests
CREATE POLICY "Users can view responses to their requests"
    ON donation_responses
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM blood_requests
            WHERE blood_requests.id = donation_responses.request_id
            AND blood_requests.user_id = auth.uid()
        )
    );

-- Users can create responses to requests
CREATE POLICY "Users can create responses"
    ON donation_responses
    FOR INSERT
    WITH CHECK (auth.uid() = donor_id);

-- Users can update their own responses
CREATE POLICY "Users can update their own responses"
    ON donation_responses
    FOR UPDATE
    USING (auth.uid() = donor_id);

-- Request creators can update response status
CREATE POLICY "Request creators can update response status"
    ON donation_responses
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM blood_requests
            WHERE blood_requests.id = donation_responses.request_id
            AND blood_requests.user_id = auth.uid()
        )
    );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_donation_responses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER donation_responses_updated_at
    BEFORE UPDATE ON donation_responses
    FOR EACH ROW
    EXECUTE FUNCTION update_donation_responses_updated_at();
