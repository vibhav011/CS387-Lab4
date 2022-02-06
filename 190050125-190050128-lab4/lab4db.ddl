DROP TABLE IF EXISTS ball_by_ball;
DROP TABLE IF EXISTS umpire_match;
DROP TABLE IF EXISTS player_match;
DROP TABLE IF EXISTS match;
DROP TABLE IF EXISTS owner;
DROP TABLE IF EXISTS venue;
DROP TABLE IF EXISTS umpire;
DROP TABLE IF EXISTS team;
DROP TABLE IF EXISTS player;

--Player information
CREATE TABLE player (
    player_id INT,
    player_name TEXT,
    dob DATE,
    batting_hand TEXT,
    bowling_skill TEXT,
    country_name TEXT,
    PRIMARY KEY(player_id)
);

--Team id and name
CREATE TABLE   team (
    team_id INT ,
    team_name TEXT,
    PRIMARY KEY(team_id)
);

--Umpire information
CREATE TABLE umpire (
    umpire_id INT,
    umpire_name TEXT,
    country_name TEXT,
    PRIMARY KEY(umpire_id)
);

--Venue information
CREATE TABLE venue (
    venue_id INT,
    venue_name TEXT,
    city_name TEXT,
    country_name TEXT,
    capacity INT,
    PRIMARY KEY(venue_id)
);

--Owner information
CREATE TABLE   owner (
    owner_id INT ,
    owner_name TEXT,
    owner_type TEXT,
    team_id INT,
    stake INT CHECK(stake between 1 and 100),
    PRIMARY KEY(owner_id),
    FOREIGN KEY(team_id) references team on delete set null
);

--Match information
CREATE TABLE   match (
    match_id INT,
    season_year INT, 
    team1 INT,
    team2 INT,
    venue_id INT,
    toss_winner INT,
    match_winner INT,
    toss_name TEXT CHECK(toss_name='field' or toss_name='bat'),
    win_type TEXT CHECK(win_type='wickets' or win_type='runs' or win_type IS NULL),
    man_of_match INT,
    win_margin INT,
    attendance INT,
    PRIMARY KEY(match_id),
    FOREIGN KEY(venue_id) references venue on delete set null,
    FOREIGN KEY(team1) references team on delete set null,
    FOREIGN KEY(team2) references team on delete set null,
    FOREIGN KEY(toss_winner) references team on delete set null,
    FOREIGN KEY(match_winner) references team on delete set null,
    FOREIGN KEY(man_of_match) references player on delete set null
   
);

--For each match contains all players along with their role and team
CREATE TABLE   player_match (
    playermatch_key bigINT,
    match_id INT,
    player_id INT,
    role_desc TEXT CHECK(role_desc='Player' or role_desc='Keeper' or role_desc='CaptainKeeper' or role_desc='Captain'),
    team_id INT,
    PRIMARY KEY(playermatch_key),
    FOREIGN KEY(match_id) references match on delete set null,
    FOREIGN KEY(player_id) references player on delete set null,
    FOREIGN KEY(team_id) references team on delete set null
     
);

--For each match contains info of all umpires
CREATE TABLE   umpire_match (
    umpirematch_key bigINT,
    match_id INT,
    umpire_id INT,
    role_desc TEXT CHECK(role_desc='Field' or role_desc='Third'),
    PRIMARY KEY(umpirematch_key),
    FOREIGN KEY(match_id) references match on delete set null,
    FOREIGN KEY(umpire_id) references umpire on delete set null     
);

--Information for each ball
CREATE TABLE   ball_by_ball (
    match_id INT,
    innings_no INT CHECK(innings_no=1 or innings_no=2),  
    over_id INT,
    ball_id INT,
    runs_scored INT CHECK(runs_scored between 0 and 6),
    extra_runs INT,
    out_type TEXT CHECK(out_type='caught' or out_type='caught and bowled' or out_type='bowled' or out_type='stumped' or out_type='retired hurt' or out_type='keeper catch' or out_type='lbw'or out_type='run out' or out_type='hit wicket' or out_type IS NULL),
    striker INT,
    non_striker INT,
    bowler INT,
    PRIMARY KEY(match_id, innings_no, over_id,ball_id),
    FOREIGN KEY (match_id) references match on delete set null,
    FOREIGN KEY(striker) references player on delete set null,
    FOREIGN KEY(non_striker) references player on delete set null,
    FOREIGN KEY(bowler) references player on delete set null
);

CREATE SEQUENCE IF NOT EXISTS venues_seq START WITH 1000 INCREMENT BY 1;

--Stake constraint
CREATE OR REPLACE FUNCTION check_stake_constraint() RETURNS trigger
AS $$
BEGIN
    IF (SELECT SUM(stake) FROM owner WHERE team_id = NEW.team_id) > 100 THEN
        RAISE EXCEPTION 'Sum of stakes for a team should be less than or equal to 100';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER stake_sum AFTER INSERT OR UPDATE
ON owner
FOR EACH ROW
EXECUTE FUNCTION check_stake_constraint();

--Attendance constraint on match table
CREATE OR REPLACE FUNCTION check_attendance_constraint() RETURNS trigger
AS $$
BEGIN
    IF TG_TABLE_NAME = 'match' THEN
        IF NEW.attendance > (SELECT capacity FROM venue WHERE venue_id = NEW.venue_id) THEN
            RAISE EXCEPTION 'Attendance should be less than or equal to capacity';
        END IF;
    ELSIF TG_TABLE_NAME = 'venue' THEN
        IF NEW.capacity < ANY (SELECT attendance FROM match WHERE venue_id = NEW.venue_id) THEN
            RAISE EXCEPTION 'Attendance should be less than or equal to capacity';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER attendance_limit AFTER INSERT OR UPDATE
ON match
FOR EACH ROW
EXECUTE FUNCTION check_attendance_constraint();

CREATE OR REPLACE TRIGGER attendance_limit AFTER INSERT OR UPDATE
ON venue
FOR EACH ROW
EXECUTE FUNCTION check_attendance_constraint();

--Umpire constraint
CREATE OR REPLACE FUNCTION check_umpire_constraint() RETURNS trigger
AS $$
BEGIN
    IF (SELECT COUNT(*) FROM umpire_match WHERE match_id = NEW.match_id AND role_desc = 'Field') > 2 OR
    (SELECT COUNT(*) FROM umpire_match WHERE match_id = NEW.match_id AND role_desc = 'Third') > 1 THEN
        RAISE EXCEPTION 'Field umpires can be at most 2 and third umpires can be at most 1';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER umpire_constraint AFTER INSERT OR UPDATE
ON umpire_match
FOR EACH ROW
EXECUTE FUNCTION check_umpire_constraint();