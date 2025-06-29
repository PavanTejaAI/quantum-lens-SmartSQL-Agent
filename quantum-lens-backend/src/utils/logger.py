import logging
import sys

def get_logger():
    logger = logging.getLogger("QUANTUM-LENS-AI")
    logger.setLevel(logging.INFO)
    
    # Check if handlers already exist to prevent duplicates
    if not logger.handlers:
        formatter = logging.Formatter(
            "%(asctime)s | %(name)s | %(levelname)s | %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S"
        )
        
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setFormatter(formatter)
        logger.addHandler(console_handler)
    
    return logger
